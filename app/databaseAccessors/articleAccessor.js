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
    const article = await Article.findById({ _id: articleId });
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
   * @TODO getArticlesByAuthorEmail
   */

  /**
   * @TODO getArticlesByEditorEmail
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
   * resolveCommentById method
   *
   * This method finds the comment with the ID
   * and resolves it.
   *
   * @param {commentId} mongo Id of the comment to be resolved
   */
  static async resolveCommentById(commentId) {
    await Connection.open();
    // find the comment by ID and then resolve it
    await Article.findOneAndUpdate(
      { "comments._id": commentId },
      {
        $set: {
          "comments.$.commentStatus": "resolved",
        },
      }
    );
  }

  /**
   *
   * Search for articles with the given query and path
   *
   * @param {*} search the term(s) to search for
   * @param {*} fields the field to search for
   */
  static async fuzzySearchArticles(search, fields) {
    await Connection.open();

    const results = await Article.aggregate([
      {
        $search: {
          index: "article_text_index",
          text: {
            query: search,
            path: fields,
            fuzzy: {},
          },
        },
      },
    ]);

    return results;
  }

  /**
   * searchArticles method
   *
   * This method finds all articles that match the search query
   *
   * @param {query} json object of query we want
   * @param {limit} numerical limit to the number of elements to return
   */
  static async searchArticles(query, limit) {
    await Connection.open();
    if (limit <= 0) {
      return [];
    } else {
      return await Article.find(query).limit(limit);
    }
  }

  static async createArticle(article) {
    await Connection.open();
    const newArticle = new Article(article);
    // await newArticle.save();
    return newArticle;
  }
}
