import PendingArticle from "../models/pending.article.js";
import Article from "../models/article.js";
import Connection from "../db/connection.js";
import mongoose from "mongoose";
import PhotographyStatus from "../models/enums/photography_status.js";

/**
get articles by author username
get articles by multiple categories
get articles by WritingStatus
get articles by issue number
 */

/**
 * Articles Accessor Class
 *
 * Accesses the articles
 */
export default class ArticlesAccessor {

  /**
   * getArticleByTitle Method
   *
   * This method retrieves the article MongoDB object from the
   * database. Throws an error if there is a pathology.
   *
   * Static - no instance required.
   * Async - promises to return the user after finding it.
   *
   * @param {String} title
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
  * getArticlesByAuthorID method
  * 
  * Retrieves all articles by the given author ObjectID.
  * 
  * @param {ObjectID} author 
  * @returns array of articles
  */
  static async getArticlesByAuthorID(author) {
    try {
      await Connection.open();
      const articles = await Article.find({ authors: { $in: [author] } });
      return articles;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  /**
  * getArticlesByEditorID method
  * 
  * Retrieves all articles by the given editor ObjectID.
  * 
  * @param {ObjectID} editor 
  * @returns array of articles
  */
  static async getArticlesByEditorID(editor) {
    try {
      await Connection.open();
      const articles = await Article.find({ editors: { $in: [editor] } });
      return articles;
    } catch (e) {
      console.log(e);
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

  /**
   * getArticlesByCreationDate method
   * 
   * Retrieves all articles created on the given date.
   * 
   * @param {Date} date 
   * @returns an array of articles
   */
  static async getArticlesByCreationDate(date) {
    try {
      await Connection.open();
      const articles = await Article.find({ creationTime: date });
      return articles;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  /**
   * getArticlesByModifiedDate method
   * 
   * Retrieves all articles modified on the given date.
   * 
   * @param {Date} date 
   * @returns an array of articles
   */
  static async getArticlesByModifiedDate(date) {
    try {
      await Connection.open();
      const articles = await Article.find({ modificationTime: date });
      return articles;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  /**
   * getArticleBySlug method
   * 
   * This method retrieves an article based on 
   * the given slug.
   * 
   * @param {String} slug 
   * @returns article
   */
  static async getArticleBySlug(slug) {
    try {
      await Connection.open();
      const article = await Article.findOne({ slug: slug });
      return article;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  /**
   * getArticleByIssueNumber method
   * 
   * This method retrieves all article in the given
   * issue number.
   * 
   * @param {Integer} issueNumber 
   * @returns article
   */
  static async getArticleBySlug(issueNumber) {
    try {
      await Connection.open();
      const articles = await Article.find({ issueNumber : issueNumber });
      return articles;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  /**
   * getArticleByArticleStatus method
   * 
   * This method retrieves all articles based on 
   * the article status.
   * 
   * @param {ArticleStatus} articleStatus 
   * @returns array of articles
   */
  static async getArticlesByArticleStatus(articleStatus) {
    try {
      await Connection.open();
      const articles = await Article.find({ articleStatus: articleStatus });
      return articles;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  /**
   * getArticleByWritingStatus method
   * 
   * This method retrieves all articles based on 
   * the writing status.
   * 
   * @param {WritingStatus} writingStatus 
   * @returns array of articles
   */
  static async getArticlesByWritingStatus(writingStatus) {
    try {
      await Connection.open();
      const articles = await Article.find({ writingStatus: writingStatus });
      return articles;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  /**
   * getArticleByPhotographyStatus method
   * 
   * This method retrieves all articles based on 
   * the photography status.
   * 
   * @param {PhotographyStatusStatus} photographyStatus 
   * @returns array of articles
   */
  static async getArticlesByPhotographyStatus(photographyStatus) {
    try {
      await Connection.open();
      const articles = await Article.find({ photographyStatus: photographyStatus });
      return articles;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  /**
   * getArticleByDesignStatus method
   * 
   * This method retrieves all articles based on 
   * the design status.
   * 
   * @param {DesignStatus} designSatus 
   * @returns array of articles
   */
  static async getArticlesByDesignStatus(designStatus) {
    try {
      await Connection.open();
      const articles = await Article.find({ designStatus: designStatus });
      return articles;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  /**
   * getArticle method
   *
   * returns the article with given MongoDB ID
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

}
