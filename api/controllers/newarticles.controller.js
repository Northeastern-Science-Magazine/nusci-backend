/** REQUIRES REWORK */

import ArticlesAccessor from "../database_accessor/articles.accessor.js";
import Errors from "../error/errors.js";
import handleError from "../error/error.handler.js";
/**
 * Unsure about this one.
 */
export default class NewArticlesCTRL {
  static async apiPostArticle(req, res, next) {
    try {
      //parse through the submission, enter it into the database
      res.json(req.body);
    } catch (e) {
      return handleError(res, Errors[500].DataPOST);
    }
  }

  static async apiGetPostArticlePage(req, res, next) {
    //get the existing draft if needed, then send it in EJS to load fields
    res.render("post_article");
  }
}
