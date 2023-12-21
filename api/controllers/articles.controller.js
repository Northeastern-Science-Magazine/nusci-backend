import ArticlesAccessor from "../database_accessor/articles.accessor.js";
import Errors from "../error/errors.js";
import handleError from "../error/error.handler.js";

//controller for finished articles request (on the database)

export default class ArticlesCTRL {
  static async apiGetArticle(req, res, next) {
    try {
      let id = req.params.id || {};

      let article = await ArticlesAccessor.getArticle(id);

      if (!article) {
        return handleError(res, Errors[404].NotFound);
      }

      res.render("article.ejs", { article });
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
