import Article from "../models/article.js";
import Connection from "../db/connection.js";
import mongoose from "mongoose";

export default class ArticlesAccessor {
    static async postArticles(author, article) {
        try {
            const articleDoc = {
                author: author,
                article: article,
            };

            return await Article.create(articleDoc);
        } catch (e) {
            console.error(e);
            throw e;
        }
    }

    static async getArticle(articleId) {
        try {
            await Connection.open("ArticleInfo");
            const article = await Article.findById(
                new mongoose.Types.ObjectId(articleId)
            );
            return article;
        } catch (e) {
            console.error(e);
            throw e;
        }
    }

    static async getAllArticles() {
        try {
            await Connection.open("ArticleInfo");
            const articles = await Article.find({});
            return articles;
        } catch (e) {
            console.error(e);
            throw e;
        }
    }
}
