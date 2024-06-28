import ArticlesAccessor from "../databaseAccessors/articleAccessor.js";
import { ErrorArticleNotFound } from "../error/httpErrors.js";

/**
 * Articles Controller class
 */
export default class ArticlesCTRL {
  static async apiGetArticles(req, res, next) {
    try {
      let articles = await ArticlesAccessor.getAllArticles();

      return res.json({ articles });
    } catch (e) {
      ErrorArticleNotFound.throwHttp(req, res);
    }
  }
}
