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
      //res.json(req.body);

      // Handle the case where year is not a valid number
      // For example, return an error response or set a default value
      if (isNaN(req.body.year)) {
        return handleError(res, Errors[400].InvalidYear);
      }

      // Construct article object based on schema
      const articleDoc = {
        title: req.body.title,
        author: req.body.author,
        year: parseInt(req.body.year),
        major: req.body.major,
        categories: JSON.parse(req.body.selectedCategories),
        date: req.body.date,
        coverImage: req.body.coverimage,
        body: JSON.parse(req.body.body),
        pullquotes: JSON.parse(req.body.pull),
        elementOrder: JSON.parse(req.body.order)
      }

      // Create article in the database
      await ArticlesAccessor.postArticle(articleDoc);
      res.json(req.body);
    } catch (e) {
      process.stdout.write(e + "\n");
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
