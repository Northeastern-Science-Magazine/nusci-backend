import ArticlesAccessor from "../database_accessor/articles.accessor.js";

//controller for finished articles request (on the database)

export default class ArticlesCTRL {
    static async apiGetArticle(req, res, next) {
        try {
            let id = req.params.id || {};

            // GET INFORMATION FROM DB HERE ONCE MODELS ARE IMPLEMENTED
            let reviews = await ArticlesAccessor.getArticles(id);

            if (!reviews) {
                req.error = 4040;
                return next();
            }

            // will be templated, this is just boilerplate
            return res.json({ reviews });
        } catch (e) {
            req.error = 4000;
            return next();
        }
    }
}
