import Article from "../models/article.js";
import Connection from "../db/connection.js";
import mongoose from "mongoose";

/**
 * Articles Accessor Class
 *
 * I am truly unsure about this one dawg
 */
export default class ArticlesAccessor {
  static async postArticles(articleDoc) {
    try {
      await Connection.open("articles");
      const article = await Article.create(articleDoc);
      return article;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  static async getArticle(articleId) {
    try {
      await Connection.open("articles");
      const article = await Article.findById(new mongoose.Types.ObjectId(articleId));
      return article;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  static async getAllArticles() {
    try {
      await Connection.open("articles");
      const articles = await Article.find({});
      return articles;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
}
