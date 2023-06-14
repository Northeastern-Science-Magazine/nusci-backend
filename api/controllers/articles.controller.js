//controller for finished articles request (on the database)
import path from "path";
import ArticlesAccessor from "../database_accessor/articles_accessor.js";

export default class ArticlesCTRL {
    static async apiGetArticle(req, res, next) {
        try {
            let id = req.params.id || {};

            // GET INFORMATION FROM DB HERE ONCE MODELS ARE IMPLEMENTED
            let reviews = await ArticlesAccessor.getArticles(id);

            if (!reviews) {
                return res.status(404).json({ error: "Not found." });
            }

            // will be templated, this is just boilerplate
            return res.json({ reviews });
        } catch (e) {
            return res.status(500).json({ error: "Server error" });
        }
    }
}
