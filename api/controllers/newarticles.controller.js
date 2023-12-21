import path from "path";
import ArticlesAccessor from "../database_accessor/articles.accessor.js";
import Errors from "../error/errors.js";
import handleError from "../error/error.handler.js";

export default class NewArticlesCTRL {
  static async apiPostArticle(req, res, next) {
    try {
      const author = req.body.author;
      const article = req.body.article;

      const articleResponse = await ArticlesAccessor.postArticles(author, article);
      res.json({ status: "success" });
    } catch (e) {
      return handleError(res, Errors[500].DataPOST);
    }
  }
}
