import IssueMapAccessor from "../databaseAccessors/issueMapAccessor.js";
import { ErrorInvalidRequestBody, ErrorUnexpected, HttpError } from "../error/errors.js";
import { IssueMapResponse } from "../models/apiModels/issueMap.js";

/**
 * IssueMapController Class
 *
 * This class controls the behaviour of any web request
 * related to IssueMaps.
 */
export default class IssueMapController {
  /**
   * method to delete an article from the issue map.
   *
   * Deletes an article from the issue map.
   *
   * @param {Request} req
   * @param {Response} res
   */
  static async removeArticle(req, res) {
    try {
      const issueNumber = req.body.issueNumber;
      const articleSlug = req.body.articleSlug;
      console.log(issueNumber, articleSlug);

      if (!issueNumber || !articleSlug) {
        throw new ErrorInvalidRequestBody();
      }

      const updatedIssue = await IssueMapAccessor.removeArticleFromIssue(issueNumber, articleSlug);

      console.log("final res",updatedIssue);

      res.status(200).json(updatedIssue);
    } catch (e) {
      if (e instanceof HttpError) {
        e.throwHttp(req, res);
      } else {
        console.log(e);
        new ErrorUnexpected(e.message).throwHttp(req, res);
      }
    }
  }
}
