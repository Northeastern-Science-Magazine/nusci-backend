import IssueMapAccessor from "../databaseAccessors/issueMapAccessor.js";
import {
  ErrorInvalidRequestBody,
  ErrorUnexpected,
  HttpError,
  ErrorSectionNotFound,
  ErrorIssueMapNotFound,
} from "../error/errors.js";
import UsersAccessor from "../databaseAccessors/userAccessor.js";

import IssueMapAccessor from "../databaseAccessors/issueMapAccessor";
import { IssueMapCreate, IssueMapResponse } from "../models/apiModels/issueMap";
import Validate from "../models/validationSchemas/validateSchema.js";
import { number } from "../models/apiModels/baseModel.js";

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
      Validate.incoming(
        req.body, 
        {
          issueNumber: { type: number, required: true },
          issueName: { type: string, required: true },
          pages: {type: number, required: true }
        },
        {
          sections: { type: array, items: { 
            sectionName: { type: string },
            sectionColor: { type: string }
          }}
        }
      );

      // check for an already existing issueMap with the same issue number
      const issueMapByIssueNumber = await IssueMapAccessor.getIssueMapByIssueNumber(req.body.issueNumber);
      if (issueMapByIssueNumber) {
        // can I add a new error to errors.js
        throw new ErrorIssueMapExists();
      }

      // post to database using accessor, which returns the issue map (db model)
      const postedIssueMap = IssueMapAccessor.postIssueMap(req.body);

      // validating outgoing issueMap
      Validate.outgoing(postedIssueMap, IssueMapResponse(), null);

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
