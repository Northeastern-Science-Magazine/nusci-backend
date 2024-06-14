import ArticlesAccessor from "../database_accessor/articles.accessor.js";
import { ErrorArticleNotFound } from "../error/http_errors.js";

/**
 * Articles Controller class
 */
export default class ArticlesCTRL {
  static async apiGetArticles(req, res, next) {
    try {
      let articles = await ArticlesAccessor.getAllArticles();

      return res.json({ articles });
    } catch (e) {
      throw ErrorArticleNotFound.throwHttp(req, res);
    }
  }
}
