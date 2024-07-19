import Article from "../models/dbModels/article.js";
import Connection from "../db/connection.js";
import { ErrorInternalAPIModelFieldValidation } from "../error/internalErrors.js";

/**
 * Articles Accessor Class
 *
 * Accesses the articles
 */
export default class ArticlesAccessor {
  /**
   * getArticle method
   *
   * returns the article with given MongoDB Id
   *
   * @param {ObjectId} articleId
   * @returns article
   */
  static async getArticle(articleId) {
    try {
      await Connection.open();
      const article = await Article.findBy({ _id: articleId });
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  /**
   * getArticleByTitle Method
   *
   * This method retrieves the article MongoDB object from the
   * database. Throws an error if there is a pathology.
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
   * @TODO getArticlesByAuthorUsername
   */

  /**
   * @TODO getArticlesByEditorUsername
   */

  /**
   * getArticlesByAuthorID method
   *
   * Retrieves all articles by the given author ObjectId.
   *
   * @param {ObjectID} author
   * @returns array of articles
   */
  static async getArticlesByAuthorId(author) {
    try {
      await Connection.open();
      const articles = await Article.find({ authors: { $in: [author] } });
      return articles;
    } catch (e) {
      console.log(e);
      ErrorInternalAPIModelFieldValidation(e);
    }
  }

  /**
   * @TODO getArticlesByEditorUsername
   */

  /**
   * getArticlesByEditorID method
   *
   * Retrieves all articles by the given editor ObjectId.
   *
   * @param {ObjectID} editor
   * @returns array of articles
   */
  static async getArticlesByEditorId(editor) {
    try {
      await Connection.open();
      const articles = await Article.find({ editors: { $in: [editor] } });
      return articles;
    } catch (e) {
      console.log(e);
      ErrorInternalAPIModelFieldValidation(e);
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
      await Connection.open();
      const articles = await Article.find({ categories: { $in: [category] } });
      return articles;
    } catch (e) {
      console.error(e);
      ErrorInternalAPIModelFieldValidation(e);
    }
  }

  /**
   * @TODO getArticlesByCategories
   *
   * method should take in a list of categories and return articles that have ALL of the categories
   *
   */

  /**
   * @TODO getArticlesByIssueAndArticleStatus
   */

  /**
   * @TODO getArticlesByIssueAndWritingStatus
   */

  /**
   * @TODO getArticlesByIssueAndDesignStatus
   */

  /**
   * @TODO getArticlesByIssueAndPhotographyStatus
   */

  /**
   * getArticleByIssueNumber method
   *
   * This method retrieves all article in the given
   * issue number.
   *
   * @param {Integer} issueNumber
   * @returns article
   */
  static async getArticleByIssueNumber(issueNumber) {
    try {
      await Connection.open();
      const articles = await Article.find({ issueNumber: issueNumber });
      return articles;
    } catch (e) {
      console.log(e);
      ErrorInternalAPIModelFieldValidation(e);
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
      ErrorInternalAPIModelFieldValidation(e);
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
      ErrorInternalAPIModelFieldValidation(e);
    }
  }

  /**
   * getArticleByPhotographyStatus method
   *
   * This method retrieves all articles based on
   * the photography status.
   *
   * @param {PhotographyStatus} photographyStatus
   * @returns array of articles
   */
  static async getArticlesByPhotographyStatus(photographyStatus) {
    try {
      await Connection.open();
      const articles = await Article.find({ photographyStatus: photographyStatus });
      return articles;
    } catch (e) {
      console.log(e);
      ErrorInternalAPIModelFieldValidation(e);
    }
  }

  /**
   * getArticleByDesignStatus method
   *
   * This method retrieves all articles based on
   * the design status.
   *
   * @param {DesignStatus} designStatus
   * @returns array of articles
   */
  static async getArticlesByDesignStatus(designStatus) {
    try {
      await Connection.open();
      const articles = await Article.find({ designStatus: designStatus });
      return articles;
    } catch (e) {
      console.log(e);
      ErrorInternalAPIModelFieldValidation(e);
    }
  }

  /**
   * @TODO modify this method to getArticlesByCreationTimeRange
   *
   * @TODO Assume start time is always passed in. If two parameters.
   * then assume first param start, and second param end.
   *
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
      ErrorInternalAPIModelFieldValidation(e);
    }
  }

  /**
   * @TODO modify this method to getArticlesByModificationTimeRange
   *
   * @TODO Assume start time is always passed in. If two parameters.
   * then assume first param start, and second param end.
   *
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
      ErrorInternalAPIModelFieldValidation(e);
    }
  }

  /**
   * addCommentBySlug method
   *
   * This method finds the article with the given 
   * slug and adds the given comment to its comments.
   *
   * @param {slug}  slug of the article to find
   * @param {comment} comment to be added to the article
   * @returns a single updated article
   */
  static async addCommentBySlug(slug, comment) {
    try {
      await Connection.open();
      // update the article by adding the new comment to its array
      const newArticle = await Article.findOneAndUpdate(
        { slug: slug },
        {
          "$push":
          {
            "article.$[].comments": comment
          }
        },
        { returnNewDocument: true },
      );
      return newArticle;
    } catch (e) {
      console.log(e);
      ErrorInternalAPIModelFieldValidation(e);
    }
  }
}
