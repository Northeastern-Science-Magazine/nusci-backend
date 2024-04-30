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
   * ArticlesAccessor Method
   *
   * This method retrieves the article MongoDB object from the
   * database. Throws an error if there is a pathology.
   *
   * Static - no instance required.
   * Async - promises to return the user after finding it.
   *
   * @param {String} username
   * @returns the Article associated with the given Title in
   *          the database.
   */
  static async getArticleByTitle(title) {
    try {
      await Connection.open();
      const article = await Article.findOne({ title: title });
      return article;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  /**
   * getPendingArticleByTitle Method
   *
   * This method pulls from the pending articles database to find
   * a specific article given a title
   *
   * @param {*} title of article to find
   * @returns the found article
   */
  static async getPendingArticleByTitle(title) {
    try {
      await Connection.open();
      const article = await PendingArticle.findOne({ title: title });
      return article;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  /**
   * Posts a new article to the pending articles database
   *
   * Static - no instance required.
   * Async - promises to return the user after creating it.
   * 
   * @param {*} articleDoc
   * @returns MongoDB user object
   */
  static async postArticle(articleDoc) {
    try {
      await Connection.open();
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
      await Connection.open();
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
      await Connection.open();
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
      await Connection.open();
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
  
  static async deleteArticleByUsername(username) {
    try {
      await Connection.open("articles");
      await Article.deleteMany({authorUsername : username});
    } catch (e) {
      console.error(e);
      throw e;
    }
  }



  /**
   * searchArticleByTitle method
   *
   * returns the articles with the given keyword in its title
   *
   * @param {String} articleKeyword
   * @returns articles as an array
   */
  static async searchArticleByTitle(articleKeyword) {
    try {
      await Connection.open("articles");
      const articles = await Article.find({title: {$regex: /articleKeyword/, $options: 'i'}})
      return articles;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  /**
   * getArticlesByCategory method
   *
   * Return all articles containing the
   * given category
   *
   * @param {String} category
   * @returns array of articles
   */
  static async getArticlesByCategory(category) {
    try {
      await Connection.open("articles");
      const articles = await Article.find({ categories: { $in: [category] } });
      return articles;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
}
