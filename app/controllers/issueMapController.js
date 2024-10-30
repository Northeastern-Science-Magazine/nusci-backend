import { IssueMapUpdate } from "../models/apiModels/issueMap";
import { IssueMapResponse } from "../models/apiModels/issueMap";

/**
 * IssueMapController Class
 *
 * This class controls the behaviour of any web request
 * related to IssueMaps.
 */
export default class IssueMapController {
    static async patchSection(req, res) {
        const updates = new IssueMapUpdate(req.body);
        if(req.body.newSectionName != null){
            //update the section name
        }

        if(req.body.newSectionColor != null){
            //update the section color. 
        }

        const updatedIssueResponse = new IssueMapResponse(updatedIssueResponse.toObject());
        try{
            res.status(200).json(updatedIssueResponse);
        } catch (e) {
            if (e instanceof HttpError) {
              e.throwHttp(req, res);
            } else {
              new ErrorUnexpected(e.message).throwHttp(req, res);
            }
          }
     
      } 
    }

