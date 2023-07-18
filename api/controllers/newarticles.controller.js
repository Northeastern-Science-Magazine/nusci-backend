//controller for the create new articles request
//import dao
import path from "path";
import ArticlesAccessor from "../database_accessor/articles_accessor.js";

export default class NewArticlesCTRL {
    static async apiPostArticle(req, res, next) {
        try {
            const author = req.body.author
            const article = req.body.article

            const articleResponse = await ArticlesAccessor.postArticles(
                author,
                article
            )
            res.json({ status: "success" })
        } catch (e) {
            return res.status(500).json({ error: "Server error" });
        }
    }
}
