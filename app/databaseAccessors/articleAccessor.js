import Article from "../models/dbModels/article.js";
import Connection from "../db/connection.js";

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
    await Connection.open();
    const article = await Article.findBy({ _id: articleId });
    return article;
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
    await Connection.open();
    const article = await Article.findOne({ title: title });
    return article;
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
    await Connection.open();
    const article = await Article.findOne({ slug: slug });
    return article;
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
    await Connection.open();
    const articles = await Article.find({ authors: { $in: [author] } });
    return articles;
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
    await Connection.open();
    const articles = await Article.find({ editors: { $in: [editor] } });
    return articles;
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
    await Connection.open();
    const articles = await Article.find({ categories: { $in: [category] } });
    return articles;
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
    await Connection.open();
    const articles = await Article.find({ issueNumber: issueNumber });
    return articles;
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
    await Connection.open();
    const articles = await Article.find({ articleStatus: articleStatus });
    return articles;
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
    await Connection.open();
    const articles = await Article.find({ writingStatus: writingStatus });
    return articles;
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
    await Connection.open();
    const articles = await Article.find({ photographyStatus: photographyStatus });
    return articles;
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
    await Connection.open();
    const articles = await Article.find({ designStatus: designStatus });
    return articles;
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
    await Connection.open();
    const articles = await Article.find({ creationTime: date });
    return articles;
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
    await Connection.open();
    const articles = await Article.find({ modificationTime: date });
    return articles;
  }

  /**
   * updateArticle method
   *
   * updates the article with the parameter provided
   *
   * @param {string} slug
   * @param {JSON} update
   * @returns updated article
   */
  static async updateArticle(slug, update) {
    await Connection.open();
    const article = await Article.findOneAndUpdate({ slug }, update, { new: true })
      .populate("authors")
      .populate("comments.user")
      .populate("editors")
      .populate("designers")
      .populate("photographers")
      .populate("approvingUser")
      .exec();
    return article;
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
    await Connection.open();
    // update the article by adding the new comment to its array
    const newArticle = await Article.findOneAndUpdate(
      { slug: slug },
      {
        $push: {
          comments: comment,
        },
      },
      { returnDocument: "after" }
    )
      .populate("comments.user")
      .populate("authors")
      .populate("editors")
      .populate("designers")
      .populate("photographers")
      .populate("approvingUser")
      .exec();
    return newArticle;
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
    await Connection.open();
    // update the article by adding the new comment to its array
    const newArticle = await Article.findOneAndUpdate(
      { slug: slug },
      {
        $push: {
          comments: comment,
        },
      },
      { returnDocument: "after" }
    )
      .populate("comments.user")
      .populate("authors")
      .populate("editors")
      .populate("designers")
      .populate("photographers")
      .populate("approvingUser")
      .exec();
    return newArticle;
  }

  static async searchArticles(query) {
    await Connection.open();
    const articles = await Article.find(query);
    console.log(articles);
    return articles;
  }
}
