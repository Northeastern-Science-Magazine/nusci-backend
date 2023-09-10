//controller for the create new articles request
//import dao
import path from "path";
import ArticlesAccessor from "../database_accessor/articles.accessor.js";

export default class NewArticlesCTRL {
    static async apiPostArticle(req, res, next) {
        try {
            // Comments can and should be blank when article is first created
            req.body.comments = []

            // Get article body
            const bodyText = req.body.body;

            // Split article body into paragraphs using line breaks
            const paragraphs = bodyText.split('\n').map(paragraph => paragraph.trim());

            // Assign the paragraphs to different elements of array within req.body.body
            req.body.body = paragraphs;

            const articleResponse = await ArticlesAccessor.postArticles(req.body)
        } catch (e) {
            return res.status(500).json({ error: "Server error" });
        }
    }
}