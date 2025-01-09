import IssueMapAccessor from "../databaseAccessors/issueMapAccessor";
import { IssueMapCreate, IssueMapResponse } from "../models/apiModels/issueMap";
import Validate from "../models/"

/**
 * IssueMapController Class
 *
 * This class controls the behaviour of any web request
 * related to IssueMaps.
 */
export default class IssueMapController {

  /**
   * Creates an issue map. Receives a request with issue number, issue name, number of pages, and sections (optional)
   * @param {Request} req
   * @param {Response} res
   */
  static async createIssueMap(req, res) {
    try {
      // validate req body and create issue map
      
      const issueMap = new IssueMapCreate(req.body);
      // post to database using accessor, which returns the issue map
      const postedIssueMap = IssueMapAccessor.postIssueMap(issueMap);
      // return 
      res.status(201).json(postedIssueMap);
    }
    catch (e) {
      if (e instanceof HttpError) {
        e.throwHttp(req, res);
      } else {
        new ErrorUnexpected(e.message).throwHttp(req, res);
      }
    }
  }

}
