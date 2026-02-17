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
   * the given slug with all related fields populated.
   *
   * @param {String} slug
   * @returns article
   */
  static async getArticleBySlug(slug) {
    await Connection.open();
    const article = await Article.findOne({ slug: slug })
      //.populate("authors")
      .populate("comments.user")
      .populate("editors")
      .populate("designers")
      .populate("photographers")
      .populate("approvingUser")
      .exec();
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
   * @param {limit} numerical limit to the number of elements to return (optional)
   * @param {query} json object of query we want (optional)
   */
  static async fuzzySearchArticles(search, fields = ["title", "content"], limit, query) {
    await Connection.open();

    const pipeline = [
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
    ];

    // Add additonal query if provided
    if (query) {
      pipeline.push({ $match: query });
    }

    // if no text provided, sort by publishDate
    if (!search) {
      pipeline.push({
        $sort: { publishDate: -1 },
      });
    }

    // Add limit if provided
    if (limit && limit > 0) {
      pipeline.push({ $limit: limit });
    }
    const results = await Article.aggregate(pipeline);
    return results;
  }

  /**
   * searchArticlesWithText method
   *
   * Performs fuzzy text search on articles with optional filters and pagination.
   * Uses MongoDB Atlas Search for text search functionality.
   * Results are sorted by relevance score (not by date) to preserve search ranking.
   *
   * @param {string} textQuery the text to search for
   * @param {object} query additional MongoDB query filters (e.g., categories)
   * @param {number} limit maximum number of results to return (optional)
   * @param {number} skip number of results to skip for pagination (optional, default: 0)
   * @returns {object} object with results array and total count
   */
  static async searchArticlesWithText(textQuery, query = {}, limit, skip = 0) {
    await Connection.open();

    // Pipeline for getting results
    const resultsPipeline = [
      {
        $search: {
          index: "article_text_index",
          text: {
            query: textQuery,
            path: ["title", "articleContent.content"],
            fuzzy: {},
          },
        },
      },
    ];

    // Add additional query filters if provided
    if (Object.keys(query).length > 0) {
      resultsPipeline.push({ $match: query });
    }

    // Note: We do NOT sort by date here because MongoDB Atlas Search
    // already returns results sorted by relevance score. Sorting by date
    // would override the search relevance ranking.

    // Pipeline for counting total results (without skip/limit)
    const countPipeline = [...resultsPipeline, { $count: "total" }];

    // Add skip for pagination to results pipeline
    if (skip > 0) {
      resultsPipeline.push({ $skip: skip });
    }

    // Add limit if provided to results pipeline
    if (limit !== undefined && limit > 0) {
      resultsPipeline.push({ $limit: limit });
    }

    // Execute both pipelines in parallel
    const [results, countResult] = await Promise.all([Article.aggregate(resultsPipeline), Article.aggregate(countPipeline)]);

    const total = countResult.length > 0 ? countResult[0].total : 0;

    return { results, total };
  }

  /**
   * searchArticles method
   *
   * This method finds all articles that match the search query without text search.
   * Supports pagination and sorting.
   *
   * @param {object} query json object of query we want
   * @param {number} limit numerical limit to the number of elements to return (optional)
   * @param {number} skip number of results to skip for pagination (optional, default: 0)
   * @param {number} sortOrder 1 for ascending, -1 for descending (optional, default: -1)
   * @returns {object} object with results array and total count
   */
  static async searchArticles(query = {}, limit, skip = 0, sortOrder = -1) {
    await Connection.open();

    // Get total count (without pagination)
    const total = await Article.countDocuments(query);

    // Build query for results with pagination
    let mongoQuery = Article.find(query);

    // Apply sorting by approvalTime (or creationTime if approvalTime doesn't exist)
    mongoQuery = mongoQuery.sort({ approvalTime: sortOrder, creationTime: sortOrder });

    // Apply skip for pagination
    if (skip > 0) {
      mongoQuery = mongoQuery.skip(skip);
    }

    // Apply limit if provided and valid
    if (limit !== undefined && limit > 0) {
      mongoQuery = mongoQuery.limit(limit);
    }

    const results = await mongoQuery.exec();

    return { results, total };
  }
}
