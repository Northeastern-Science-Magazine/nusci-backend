import crypto from "crypto";
import { S3Client, PutObjectCommand, GetObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import MediaFolder from "../../models/enums/mediaFolder.js";
import { ErrorUnexpected, ErrorValidation } from "../../error/errors.js";

// presigned URLs are short lived: uploads should start right away,
// downloads only need to outlive a page view
const UPLOAD_URL_EXPIRY_SECONDS = 5 * 60;
const DOWNLOAD_URL_EXPIRY_SECONDS = 60 * 60;

// file extension for every content type we accept, used to build keys
const EXTENSIONS = {
  "application/pdf": "pdf",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

// S3 clients (cache)
let client;
let presignClient;

/**
 * S3Service Class
 *
 * Wraps the AWS SDK to generate presigned URLs so the browser
 * can upload/download media directly to/from the private bucket.
 *
 * Credentials come from the default AWS provider chain:
 * - prod: the App Runner instance role
 * - local: AWS_PROFILE, or AWS_ACCESS_KEY_ID + AWS_SECRET_ACCESS_KEY
 *
 * Locally, S3_ENDPOINT can point at an S3-compatible stand-in (MinIO) instead of AWS.
 * S3_PUBLIC_ENDPOINT is the address the browser reaches it at, if different
 * (i.e. http://minio:9000 inside docker compose, http://localhost:9000 from the browser).
 *
 * Keys are laid out as `<S3_KEY_PREFIX>/<folder>/<uuid>.<ext>`,
 * i.e. `prod/archive/0b5c...e1.pdf`.
 */
export default class S3Service {
  /**
   * Get (or create) the shared S3 client, used for calls made by the server.
   *
   * @returns {S3Client}
   */
  static client() {
    if (!client) {
      client = S3Service.createClient(process.env.S3_ENDPOINT);
    }
    return client;
  }

  /**
   * Get (or create) the client presigned URLs are signed with.
   * The URL's host is part of the signature, so it must be the
   * host the browser will actually send the request to.
   *
   * @returns {S3Client}
   */
  static presignClient() {
    if (!presignClient) {
      presignClient = S3Service.createClient(process.env.S3_PUBLIC_ENDPOINT || process.env.S3_ENDPOINT);
    }
    return presignClient;
  }

  /**
   * Creates an S3 client, pointed at AWS unless an endpoint is given.
   *
   * @param {String} endpoint optional S3-compatible endpoint, i.e. http://localhost:9000
   * @returns {S3Client}
   */
  static createClient(endpoint) {
    if (!endpoint) {
      return new S3Client({ region: process.env.AWS_REGION });
    }
    // S3-compatible servers address buckets by path (host/bucket/key), not subdomain
    return new S3Client({ region: process.env.AWS_REGION, endpoint: endpoint, forcePathStyle: true });
  }

  /**
   * Bucket name from the environment.
   *
   * @returns {String}
   */
  static bucket() {
    if (!process.env.S3_BUCKET_NAME) {
      throw new ErrorUnexpected("S3_BUCKET_NAME is not configured.");
    }
    return process.env.S3_BUCKET_NAME;
  }

  /**
   * Environment prefix every key lives under (prod, dev, ...).
   *
   * @returns {String}
   */
  static keyPrefix() {
    if (!process.env.S3_KEY_PREFIX) {
      throw new ErrorUnexpected("S3_KEY_PREFIX is not configured.");
    }
    return process.env.S3_KEY_PREFIX;
  }

  /**
   * Prefix that every key in the given folder starts with.
   *
   * @param {MediaFolder} folder
   * @returns {String} i.e. `prod/archive/`
   */
  static folderPrefix(folder) {
    return `${S3Service.keyPrefix()}/${folder.toString()}/`;
  }

  /**
   * Whether the key belongs to the given folder.
   *
   * @param {String} key
   * @param {MediaFolder} folder
   * @returns {Boolean}
   */
  static isKeyInFolder(key, folder) {
    return typeof key === "string" && key.startsWith(S3Service.folderPrefix(folder)) && !key.includes("..");
  }

  /**
   * Builds a new, unique key for a file in the given folder.
   *
   * @param {MediaFolder} folder
   * @param {String} contentType
   * @returns {String} the key
   */
  static buildKey(folder, contentType) {
    if (!folder.contentTypes.includes(contentType)) {
      throw new ErrorValidation(`Content type ${contentType} is not allowed in ${folder.toString()}.`);
    }
    return `${S3Service.folderPrefix(folder)}${crypto.randomUUID()}.${EXTENSIONS[contentType]}`;
  }

  /**
   * Generates a presigned PUT URL for a new object in the given folder.
   * The browser must send the same Content-Type header when uploading.
   *
   * @param {MediaFolder} folder
   * @param {String} contentType
   * @returns {Promise<{ key: String, uploadUrl: String, expiresIn: Number }>}
   */
  static async createUploadUrl(folder, contentType) {
    const key = S3Service.buildKey(folder, contentType);
    const command = new PutObjectCommand({
      Bucket: S3Service.bucket(),
      Key: key,
      ContentType: contentType,
    });
    const uploadUrl = await getSignedUrl(S3Service.presignClient(), command, { expiresIn: UPLOAD_URL_EXPIRY_SECONDS });
    return { key, uploadUrl, expiresIn: UPLOAD_URL_EXPIRY_SECONDS };
  }

  /**
   * Generates a presigned GET URL for an existing object.
   *
   * @param {String} key
   * @returns {Promise<String>} the URL
   */
  static async createDownloadUrl(key) {
    const command = new GetObjectCommand({ Bucket: S3Service.bucket(), Key: key });
    return getSignedUrl(S3Service.presignClient(), command, { expiresIn: DOWNLOAD_URL_EXPIRY_SECONDS });
  }

  /**
   * Looks up an object's metadata, used to confirm an upload finished.
   *
   * @param {String} key
   * @returns {Promise<{ contentType: String, contentLength: Number } | null>} null if missing
   */
  static async getObjectInfo(key) {
    try {
      const head = await S3Service.client().send(new HeadObjectCommand({ Bucket: S3Service.bucket(), Key: key }));
      return { contentType: head.ContentType, contentLength: head.ContentLength };
    } catch (e) {
      if (e?.name === "NotFound" || e?.$metadata?.httpStatusCode === 404) {
        return null;
      }
      throw e;
    }
  }
}
