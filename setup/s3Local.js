import {
  S3Client,
  CreateBucketCommand,
  PutBucketVersioningCommand,
  PutBucketCorsCommand,
  GetBucketVersioningCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import zlib from "zlib";
import { set } from "../app/util/util.js";
import archived_issue_seed from "./seed/archived_issue_seed.js";

/**
 * Sets up the bucket on the local S3 stand-in (RustFS) so uploads can be
 * tested without AWS. Safe to run more than once.
 *
 * Mirrors what the real bucket should have:
 * - versioning on, so deleted/overwritten files can be recovered
 * - CORS allowing the frontend to PUT/GET with presigned URLs
 *
 * Also uploads placeholder files for the seeded archived issues,
 * so their links and covers work locally.
 *
 * Usage: npm run s3-local (needs the s3 container from docker-compose.s3.yaml)
 */

const endpoint = process.env.S3_LOCAL_ENDPOINT || "http://localhost:9000";
const bucket = process.env.S3_BUCKET_NAME || "nusci-media";

const client = new S3Client({
  region: process.env.AWS_REGION || "us-east-1",
  endpoint: endpoint,
  forcePathStyle: true,
  credentials: {
    accessKeyId: process.env.S3_LOCAL_ACCESS_KEY || "nusci-local",
    secretAccessKey: process.env.S3_LOCAL_SECRET_KEY || "nusci-local-secret",
  },
});

try {
  try {
    await client.send(new CreateBucketCommand({ Bucket: bucket }));
    process.stdout.write(set(`[+] Created bucket ${bucket} at ${endpoint}\n`).green);
  } catch (e) {
    if (e?.name !== "BucketAlreadyOwnedByYou" && e?.name !== "BucketAlreadyExists") {
      throw e;
    }
    process.stdout.write(set(`[+] Bucket ${bucket} already exists at ${endpoint}\n`).green);
  }

  await client.send(new PutBucketVersioningCommand({ Bucket: bucket, VersioningConfiguration: { Status: "Enabled" } }));
  const versioning = await client.send(new GetBucketVersioningCommand({ Bucket: bucket }));
  process.stdout.write(set(`[+] Versioning: ${versioning.Status}\n`).green);

  await client.send(
    new PutBucketCorsCommand({
      Bucket: bucket,
      CORSConfiguration: {
        CORSRules: [
          {
            AllowedOrigins: ["http://localhost:3000", "http://localhost:3001"],
            AllowedMethods: ["GET", "PUT", "HEAD"],
            AllowedHeaders: ["*"],
            ExposeHeaders: ["ETag"],
            MaxAgeSeconds: 3000,
          },
        ],
      },
    })
  );
  process.stdout.write(set(`[+] CORS set for localhost:3000/3001\n`).green);

  const pdf = Buffer.from(
    "%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n2 0 obj<</Type/Pages/Kids[]/Count 0>>endobj\ntrailer<</Root 1 0 R>>\n%%EOF\n"
  );
  const cover = placeholderPng(300, 400, [34, 85, 51]);
  for (const issue of archived_issue_seed) {
    await client.send(
      new PutObjectCommand({ Bucket: bucket, Key: issue.pdfKey, Body: pdf, ContentType: "application/pdf" })
    );
    if (issue.coverKey) {
      await client.send(
        new PutObjectCommand({ Bucket: bucket, Key: issue.coverKey, Body: cover, ContentType: "image/png" })
      );
    }
  }
  process.stdout.write(set(`[+] Uploaded placeholder files for ${archived_issue_seed.length} seeded issues\n`).green);
  process.exit();
} catch (e) {
  process.stdout.write(set(`[-] Local S3 setup failed: ${e?.name}: ${e?.message}\n`).red);
  process.exit(1);
}

/**
 * Builds a solid color PNG, used as a placeholder cover.
 *
 * @param {Number} width
 * @param {Number} height
 * @param {List[Number]} rgb
 * @returns {Buffer}
 */
function placeholderPng(width, height, rgb) {
  const crcTable = Array.from({ length: 256 }, (_, n) => {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    return c >>> 0;
  });
  const crc32 = (buf) => {
    let c = 0xffffffff;
    for (const byte of buf) c = crcTable[(c ^ byte) & 0xff] ^ (c >>> 8);
    return (c ^ 0xffffffff) >>> 0;
  };
  const chunk = (type, data) => {
    const length = Buffer.alloc(4);
    length.writeUInt32BE(data.length);
    const body = Buffer.concat([Buffer.from(type), data]);
    const crc = Buffer.alloc(4);
    crc.writeUInt32BE(crc32(body));
    return Buffer.concat([length, body, crc]);
  };

  const header = Buffer.alloc(13);
  header.writeUInt32BE(width, 0);
  header.writeUInt32BE(height, 4);
  header[8] = 8; // bit depth
  header[9] = 2; // truecolor RGB
  const row = Buffer.concat([Buffer.from([0]), Buffer.from(Array.from({ length: width }, () => rgb).flat())]);
  const pixels = zlib.deflateSync(Buffer.concat(Array.from({ length: height }, () => row)));

  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", header),
    chunk("IDAT", pixels),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}
