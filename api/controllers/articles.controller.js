import ArticlesAccessor from "../database_accessor/articles.accessor.js";

//controller for finished articles request (on the database)

export default class ArticlesCTRL {
    static async apiGetArticle(req, res, next) {
        try {
            let id = req.params.id || {};

            let article = await ArticlesAccessor.getArticle(id);

            if (!article) {
                req.error = 4040;
                return next();
            }
          
            return res.render("article.ejs", { article });
        } catch (e) {
            return res.status(500).json({ error: "Server error" });
        }
    }

    static async apiGetArticles(req, res, next) {
        try {
            let articles = await ArticlesAccessor.getAllArticles();

            return res.json({ articles });
        } catch (e) {
            req.error = 4000;
            return next();
        }
    }
}
