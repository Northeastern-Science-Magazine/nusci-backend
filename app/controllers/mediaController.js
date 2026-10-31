import S3Service from "../services/s3/s3Service.js";
import MediaFolder from "../models/enums/mediaFolder.js";
import Authorize from "../auth/authorization.js";
import { DownloadUrlRequest, UploadUrlRequest } from "../models/zodSchemas/media.js";
import { ErrorForbidden, ErrorUnexpected, ErrorValidation, HttpError } from "../error/errors.js";

/**
 * MediaController Class
 *
 * This class controls the behaviour of any web request
 * related to media stored in S3.
 */
export default class MediaController {
  /**
   * Generates a presigned URL the browser can PUT a file to.
   * The response's key is what gets stored on the related
   * document (i.e. an ArchivedIssue's pdfKey) once the upload is done.
   *
   * @param {Request} req
   * @param {Response} res
   */
  static async createUploadUrl(req, res) {
    try {
      const parsed = UploadUrlRequest.safeParse(req.body);
      if (!parsed.success) {
        throw new ErrorValidation("Upload URL request validation failed.");
      }

      const { contentType, size } = parsed.data;
      const folder = MediaFolder.toMediaFolder(parsed.data.folder);

      if (!folder.canUpload(Authorize.getRoles(req))) {
        throw new ErrorForbidden();
      }
      if (!folder.contentTypes.includes(contentType)) {
        throw new ErrorValidation(`Content type ${contentType} is not allowed in ${folder.toString()}.`);
      }
      if (size > folder.maxBytes) {
        throw new ErrorValidation(`File exceeds the ${folder.maxBytes / (1024 * 1024)}MB limit.`);
      }

      const upload = await S3Service.createUploadUrl(folder, contentType, size);
      res.status(200).json({ ...upload, contentType });
    } catch (e) {
      MediaController.handleError(e, req, res);
    }
  }

  /**
   * Generates a short lived URL to download an uploaded image.
   * Images are public (article images, profile pictures), so no login is needed,
   * but only keys in the images folder are served: archive files go through /archive.
   *
   * @param {Request} req
   * @param {Response} res
   */
  static async getDownloadUrl(req, res) {
    try {
      const parsed = DownloadUrlRequest.safeParse(req.query);
      if (!parsed.success) {
        throw new ErrorValidation("Download URL request validation failed.");
      }

      const { key } = parsed.data;
      if (!S3Service.isKeyInFolder(key, MediaFolder.Images)) {
        throw new ErrorValidation(`Key ${key} is not in the images folder.`);
      }

      res.status(200).json({ url: await S3Service.createDownloadUrl(key), expiresIn: S3Service.downloadUrlExpiry() });
    } catch (e) {
      MediaController.handleError(e, req, res);
    }
  }

  /**
   * Sends the HTTP response for an error.
   *
   * @param {Error} e
   * @param {Request} req
   * @param {Response} res
   */
  static handleError(e, req, res) {
    if (e instanceof HttpError) {
      e.throwHttp(req, res);
    } else {
      new ErrorUnexpected(e.message).throwHttp(req, res);
    }
  }
}
