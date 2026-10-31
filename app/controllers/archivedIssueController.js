import ArchivedIssueAccessor from "../databaseAccessors/archivedIssueAccessor.js";
import UsersAccessor from "../databaseAccessors/userAccessor.js";
import Authorize from "../auth/authorization.js";
import S3Service from "../services/s3/s3Service.js";
import PdfCoverService from "../services/pdf/pdfCoverService.js";
import MediaFolder from "../models/enums/mediaFolder.js";
import { ArchivedIssueCreate, ArchivedIssueResponse } from "../models/zodSchemas/archivedIssue.js";
import {
  ErrorArchivedIssueNotFound,
  ErrorDuplicateKey,
  ErrorUnexpected,
  ErrorUserNotFound,
  ErrorValidation,
  HttpError,
} from "../error/errors.js";

/**
 * ArchivedIssueController Class
 *
 * This class controls the behaviour of any web request
 * related to archived (print) issues, whose PDFs and covers live in S3.
 *
 * Upload flow:
 * 1. POST /media/upload-url for the PDF, PUT the file to its uploadUrl
 * 2. POST /archive with the returned key to save the issue,
 *    which renders the PDF's first page as its cover
 */
export default class ArchivedIssueController {
  /**
   * Lists every archived issue, newest first, with presigned media URLs.
   *
   * @param {Request} req
   * @param {Response} res
   */
  static async getAll(req, res) {
    try {
      const issues = await ArchivedIssueAccessor.getAllArchivedIssues();
      const response = await Promise.all(issues.map((issue) => ArchivedIssueController.toResponse(issue)));
      res.status(200).json(response);
    } catch (e) {
      ArchivedIssueController.handleError(e, req, res);
    }
  }

  /**
   * Gets a single archived issue by its issue number.
   *
   * @param {Request} req
   * @param {Response} res
   */
  static async getByNumber(req, res) {
    try {
      const issue = await ArchivedIssueAccessor.getArchivedIssueByNumber(
        ArchivedIssueController.parseIssueNumber(req.params.issueNumber)
      );
      if (!issue) {
        throw new ErrorArchivedIssueNotFound();
      }

      res.status(200).json(await ArchivedIssueController.toResponse(issue));
    } catch (e) {
      ArchivedIssueController.handleError(e, req, res);
    }
  }

  /**
   * Saves an archived issue after its PDF has been uploaded to S3,
   * rendering the PDF's first page as the cover.
   *
   * @param {Request} req
   * @param {Response} res
   */
  static async create(req, res) {
    try {
      const parsed = ArchivedIssueCreate.safeParse(req.body);
      if (!parsed.success) {
        throw new ErrorValidation("Archived issue validation failed.");
      }
      const { issueNumber, title, pdfKey } = parsed.data;

      if (await ArchivedIssueAccessor.getArchivedIssueByNumber(issueNumber)) {
        throw new ErrorDuplicateKey(`Issue ${issueNumber} is already archived.`);
      }

      // the PDF must have actually been uploaded, and be the right kind of file
      await ArchivedIssueController.verifyUpload(pdfKey, ["application/pdf"]);

      const user = await UsersAccessor.getUserIdByEmail(Authorize.getEmail(req));
      if (!user) {
        throw new ErrorUserNotFound();
      }

      // last, since it's the slow step: download the PDF and render its first page
      const coverKey = await PdfCoverService.createCover(pdfKey);

      const now = new Date();
      let issue;
      try {
        issue = await ArchivedIssueAccessor.createArchivedIssue({
          issueNumber,
          title,
          pdfKey,
          coverKey,
          creatingUser: user._id,
          creationTime: now,
          modificationTime: now,
        });
      } catch (e) {
        // 11000 is MongoDB's duplicate key error: a concurrent request
        // archived the same issue number after the check above
        if (e?.code === 11000) {
          throw new ErrorDuplicateKey(`Issue ${issueNumber} is already archived.`);
        }
        throw e;
      }

      res.status(201).json(await ArchivedIssueController.toResponse(issue));
    } catch (e) {
      ArchivedIssueController.handleError(e, req, res);
    }
  }

  /**
   * Deletes an archived issue. Only the record is flagged as deleted:
   * its PDF and cover stay in S3, so a mistaken delete can be undone
   * without relying on the bucket's versioning.
   *
   * @param {Request} req
   * @param {Response} res
   */
  static async delete(req, res) {
    try {
      const issueNumber = ArchivedIssueController.parseIssueNumber(req.params.issueNumber);

      const user = await UsersAccessor.getUserIdByEmail(Authorize.getEmail(req));
      if (!user) {
        throw new ErrorUserNotFound();
      }

      const issue = await ArchivedIssueAccessor.deleteArchivedIssueByNumber(issueNumber, user._id);
      if (!issue) {
        throw new ErrorArchivedIssueNotFound();
      }

      res.status(200).json({ message: `Issue ${issue.issueNumber} deleted.` });
    } catch (e) {
      ArchivedIssueController.handleError(e, req, res);
    }
  }

  /**
   * Checks that a key points at an uploaded file in the archive folder
   * with one of the allowed content types and within the size limit.
   *
   * @param {String} key
   * @param {List[String]} contentTypes
   */
  static async verifyUpload(key, contentTypes) {
    if (!S3Service.isKeyInFolder(key, MediaFolder.Archive)) {
      throw new ErrorValidation(`Key ${key} is not in the archive folder.`);
    }

    const info = await S3Service.getObjectInfo(key);
    if (!info) {
      throw new ErrorValidation(`No uploaded file found for key ${key}.`);
    }
    if (!contentTypes.includes(info.contentType)) {
      throw new ErrorValidation(`File ${key} has invalid content type ${info.contentType}.`);
    }
    if (info.contentLength > MediaFolder.Archive.maxBytes) {
      throw new ErrorValidation(`File ${key} exceeds the size limit.`);
    }
  }

  /**
   * Converts an archived issue document into its API response,
   * swapping S3 keys for presigned URLs.
   *
   * @param {ArchivedIssue} issue
   * @returns {Promise<Object>}
   */
  static async toResponse(issue) {
    const response = ArchivedIssueResponse.safeParse({
      issueNumber: issue.issueNumber,
      title: issue.title,
      pdfUrl: await S3Service.createDownloadUrl(issue.pdfKey),
      coverUrl: await S3Service.createDownloadUrl(issue.coverKey),
    });
    if (!response.success) {
      throw new ErrorValidation("Outgoing response validation failed.");
    }
    return response.data;
  }

  /**
   * Parses an issue number route param.
   *
   * @param {String} param
   * @returns {Number}
   */
  static parseIssueNumber(param) {
    const issueNumber = Number(param);
    if (!Number.isInteger(issueNumber) || issueNumber <= 0) {
      throw new ErrorValidation(`Invalid issue number ${param}.`);
    }
    return issueNumber;
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
