import PendingArticle from "../models/pending.article.js";
import Article from "../models/article.js";
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
   * @param {String} articleID
   * @returns article
   */
  static async getPendingArticle(articleID) {
    try {
      await Connection.open("articles");
      const article = await PendingArticle.findById(new mongoose.Types.ObjectId(articleID));
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

  /**
   * approveArticles method
   *
   * Given the Mongo ObjectIDs of pending articles,
   * this method will approve them.
   *
   * @param {*} articleIDs
   * @returns
   */
  static async approveArticles(articleIDs) {
    try {
      const articles = [];
      for await (const id of articleIDs) {
        const pendingArticle = await PendingArticle.findById(new mongoose.Types.ObjectId(id));
        const approvedArticle = await Article.create(pendingArticle.toJSON());
        await PendingArticle.deleteOne({ ObjectId: id });
        articles.push(approvedArticle);
      }
      return articles;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  /**
   * getArticle method
   *
   * returns the article with given ID
   *
   * @param {String} articleID
   * @returns article
   */
  static async getArticle(articleID) {
    try {
      await Connection.open("articles");
      const article = await Article.findById(new mongoose.Types.ObjectId(articleID));
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  /**
   * sortArticles method
   * 
   * the method returns an array of the
   * sorted articles  
   * 
   * @param {String} sortBy - The field to sort by, defaulting to Date.
   * @param {String} order - The order of sorting, 'asc' for ascending and 'desc' for descending, defaulting to 'asc'.
   * @param {Number} limit - The maximum number of articles allowed per page
   * @param {Number} page - The page number
   * @returns {Array} - returns an array of the sorted articles
   */
  static async sortArticles({
    sortBy = Date, // Date is from article.js
    order = 'asc', 
    limit = 10,
    page = 1
  } = {}){
    try{
      await Connection.open("articles");
      let sortOrder;
      if (order =='asc'){
        sortOrder = 1;
      } else {
        sortOrder = -1;
      }
      const skip = (page - 1) * limit;
      const articles = await Article.find({}).sort({ [sortBy]: sortOrder}) // Sort the articles by the specified field and order
      .skip(skip) 
      .limit(limit); // Limit the number of returned documents to the specified limit
    
      return articles;
    
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
}
