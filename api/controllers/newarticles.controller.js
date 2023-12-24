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
      const author = req.body.author;
      const article = req.body.article;

      const articleResponse = await ArticlesAccessor.postArticle(author, article);
      res.json({ status: "success" });
    } catch (e) {
      return handleError(res, Errors[500].DataPOST);
    }
  }

  static async apiGetPostArticlePage(req, res, next) {
    //get the existing draft if needed, then send it in EJS to load fields
    res.render("post_article");
  }
}
