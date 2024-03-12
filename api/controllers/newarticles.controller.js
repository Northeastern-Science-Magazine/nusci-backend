import ArticlesAccessor from "../database_accessor/articles.accessor.js";
import Errors from "../error/errors.js";
import handleError from "../error/error.handler.js";

export default class NewArticlesCTRL {
  /**
   * apiPostArticle
   *
   * Gets the article data from req.body, reformats to fit
   * the Pending Article Schema, and submits to pending
   * article collection.
   *
   * Returns user to list of pending articles
   *
   * @param {*} req
   * @param {*} res
   * @param {*} next
   * @returns
   */
  static async apiPostArticle(req, res, next) {
    try {
      //parse through the submission, enter it into the database
      res.json(req.body);
    } catch (e) {
      return handleError(res, Errors[500].DataPOST);
    }
  }

  /**
   * apiGetPostArticle
   *
   * Retreives the article page editor
   *
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  static async apiGetPostArticlePage(req, res, next) {
    //get the existing draft if needed, then send it in EJS to load fields
    res.render("post_article");
  }

  /**
   * apiSaveArticle
   *
   * To save progress on an article, not sumbitted
   * for approval yet.
   *
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  static async apiSaveArticle(req, res, next) {}
}
