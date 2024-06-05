import ArticlesAccessor from "../database_accessor/articles.accessor.js";
import Errors from "../error/errors.js";
import handleError from "../error/error.handler.js";

/**
 * Articles Controller class
 */
export default class ArticlesCTRL {
  static async getAllArticles(req, res) {}

  static async getArticleBySlug(req, res) {}

  static async apiGetArticle(req, res, next) {
    try {
      let id = req.params.id || {};

      let article = await ArticlesAccessor.getPendingArticle(id);

      if (article) {
        res.render("article", { article });
      } else {
        return handleError(res, Errors[404].NotFound);
      }
    } catch (e) {
      return handleError(res, Errors[500].DataPOST);
    }
  }

  static async apiGetArticles(req, res, next) {
    try {
      let articles = await ArticlesAccessor.getAllArticles();

      return res.json({ articles });
    } catch (e) {
      return handleError(res, Errors[500].DataGET);
    }
  }
}
