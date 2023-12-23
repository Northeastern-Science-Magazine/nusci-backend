import PendingArticle from "../models/pending.article.js";
import Connection from "../db/connection.js";
import mongoose from "mongoose";

/**
 * Articles Accessor Class
 *
 * Accesses the articles
 */
export default class ArticlesAccessor {
  /**
   * Posts a new article to the pending articles database
   *
   * @param {*} articleDoc
   * @returns {JSON} object
   */
  static async postArticle(articleDoc) {
    try {
      await Connection.open("articles");
      const article = await PendingArticle.create(articleDoc);
      return article;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  /**
   * getArticle method
   *
   * Gets an article based off of its Mongo ObjectID
   *
   * @param {String} articleId
   * @returns article
   */
  static async getPendingArticle(articleId) {
    try {
      await Connection.open("articles");
      const article = await PendingArticle.findById(new mongoose.Types.ObjectId(articleId));
      return article;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  /**
   * getAllArticles method
   *
   * gets all the pending articles
   *
   * @returns every single one of them as an array
   */
  static async getAllPendingArticles() {
    try {
      await Connection.open("articles");
      const articles = await PendingArticle.find({});
      return articles;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  static async approveArticles(articleID) {}
}
