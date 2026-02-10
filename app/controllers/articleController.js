import ArticlesAccessor from "../databaseAccessors/articleAccessor.js";
import UsersAccessor from "../databaseAccessors/userAccessor.js";
import Authorize from "../auth/authorization.js";
import { InternalCommentCreate } from "../models/apiModels/internalComment.js";
import { ArticleUpdate, ArticleResponse } from "../models/apiModels/article.js";
import { ErrorArticleNotFound, ErrorUnexpected, HttpError, ErrorTypeOfQuery } from "../error/errors.js";
import Utils from "./utils.js";

/**
 * ArticleController Class
 *
 * This class controls the behaviour of any web request
 * related to Articles.
 */
export default class ArticleController {
  /**
   * updateStatus method
   *
   * Handles the request to update the status of an article.
   *
   * @param {Request} req
   * @param {Response} res
   */
  static async updateStatus(req, res) {
    try {
      const { slug } = req.params;

      const updates = new ArticleUpdate(req.body);

      const updatedArticleData = await ArticlesAccessor.updateArticle(slug, updates);

      if (!updatedArticleData) {
        throw new ErrorArticleNotFound();
      }

      // Validate and construct an ArticleResponse instance
      const updatedArticleResponse = new ArticleResponse(updatedArticleData.toObject());

      // Send the validated ArticleResponse
      res.status(200).json(updatedArticleResponse);
    } catch (e) {
      if (e instanceof HttpError) {
        e.throwHttp(req, res);
      } else {
        new ErrorUnexpected(e.message).throwHttp(req, res);
      }
    }
  }

  /**
   * updateAuthors method
   *
   * Handles the request to update the list of authors for an article.
   *
   * @param {Request} req
   * @param {Response} res
   */
  static async updateAuthors(req, res) {
    try {
      const { slug } = req.params;
      const updates = new ArticleUpdate(req.body);
      const authorIds = await Utils.getUserIdsByEmails(updates.authors);
      updates.authors = authorIds;
      const updatedArticleData = await ArticlesAccessor.updateArticle(slug, updates);

      if (!updatedArticleData) {
        throw new ErrorArticleNotFound();
      }

      // Validate and construct an ArticleResponse instance
      const updatedArticleResponse = new ArticleResponse(updatedArticleData.toObject());

      res.status(200).json(updatedArticleResponse);
    } catch (e) {
      if (e instanceof HttpError) {
        e.throwHttp(req, res);
      } else {
        new ErrorUnexpected(e.message).throwHttp(req, res);
      }
    }
  }

  /**
   * addInternalComment Method
   *
   * This method adds an internal, unresolved comment to the given article.
   *
   * @param {HTTP REQ} req web request object
   * @param {HTTP RES} res web response object
   * @param {function} next middleware function
   */
  static async addInternalComment(req, res, next) {
    try {
      //comment validation
      const email = Authorize.getEmail(req);
      const user = await UsersAccessor.getUserByEmail(email);
      const userID = user._id;

      const comment = new InternalCommentCreate({ user: userID, comment: req.body.comment });

      // modify the article with the new comment
      const updatedArticle = await ArticlesAccessor.addCommentBySlug(req.params.slug, comment);

      if (!updatedArticle) {
        throw new ErrorArticleNotFound();
      }

      const finalArticle = new ArticleResponse(updatedArticle.toObject());

      //return updated article with new comment
      res.status(201).json(finalArticle);
    } catch (e) {
      if (e instanceof HttpError) {
        e.throwHttp(req, res);
      } else {
        new ErrorUnexpected(e.message).throwHttp(req, res);
      }
    }
  }

  /**
   * resolveInternalComment Method
   *
   * This method resolves an internal comment given the mongoID of the comment.
   *
   * @param {HTTP REQ} req web request object
   * @param {HTTP RES} res web response object
   * @param {function} next middleware function
   */
  static async resolveInternalComment(req, res, next) {
    try {
      // modify the comment status
      const a = await ArticlesAccessor.resolveCommentById(req.body.commentId);
      res.status(201).json({});
    } catch (e) {
      if (e instanceof HttpError) {
        e.throwHttp(req, res);
      } else {
        new ErrorUnexpected(e.message).throwHttp(req, res);
      }
    }
  }

  /**
   *
   * Helper function for searching
   * Generates a json of the query from req.body
   * @param {*} body
   * @returns {query} json object of the query
   */
  static async buildSearchQuery(body) {
    if (!body) {
      return {};
    }
    
    async function getUserIdsByEmailsQuery(listOfEmails) {
      if (!Array.isArray(listOfEmails)) {
        throw new ErrorTypeOfQuery();
      }
      const allUsers = [];
      for (let i = 0; i < listOfEmails.length; i++) {
        const user = await UsersAccessor.getUserByEmail(listOfEmails[i]);
        allUsers[i] = user._id;
      }
      return { $in: allUsers };
    }

    function numberTypeCheck(num) {
      if (!Number.isNaN(Number(num))) {
        return num;
      } else {
        throw new ErrorTypeOfQuery();
      }
    }

    function stringTypeCheck(str) {
      if (typeof str === "string") {
        return str;
      } else {
        throw new ErrorTypeOfQuery();
      }
    }

    function inQuery(cats) {
      if (Array.isArray(cats)) {
        return { $in: cats };
      } else {
        throw new ErrorTypeOfQuery();
      }
    }

    const mapping = {
      issueNumber: numberTypeCheck,
      authors: getUserIdsByEmailsQuery,
      editors: getUserIdsByEmailsQuery,
      designers: getUserIdsByEmailsQuery,
      photographers: getUserIdsByEmailsQuery,
      slug: stringTypeCheck,
      categories: inQuery,
    };

    const query = {};

    // Build query from mapping
    for (const searchOption of Object.keys(mapping)) {
      if (body.hasOwnProperty(searchOption)) {
        query[searchOption] = await mapping[searchOption](body[searchOption]);
      }
    }

    // Handle date ranges
    if (body.hasOwnProperty("before") && body.hasOwnProperty("after")) {
      query.$and = [{ approvalTime: { $gte: body.after } }, { approvalTime: { $lte: body.before } }];
    } else if (body.hasOwnProperty("before")) {
      query.approvalTime = { $lte: body.before };
    } else if (body.hasOwnProperty("after")) {
      query.approvalTime = { $gte: body.after };
    }

    return query;
  }

  /**
   * Fuzzy searches for articles based on fields with optional limit and query
   *
   * @param {Request} req
   * @param {Response} res
   */
  static async fuzzySearch(req, res) {
    try {
      let limit;
      const search = req.query.search;
      // finds the query parmeter
      const query = await ArticleController.buildSearchQuery(req.body);
      // what field (title, content, etc)
      const fields = req.body.fields;

      if (req.body.hasOwnProperty("limit")) {
        limit = Number(req.body.limit);
      }

      let results = await ArticlesAccessor.fuzzySearchArticles(search, fields, limit, query);
      res.status(200).json(results);
    } catch (e) {
      if (e instanceof HttpError) {
        e.throwHttp(req, res);
      } else {
        new ErrorUnexpected(e.message).throwHttp(req, res);
      }
    }
  }

  /**
   * search Method
   *
   * This method searches and returns all articles matching the given params
   *
   * @param {HTTP REQ} req web request object
   * @param {HTTP RES} res web response object
   * @param {function} next middleware function
   */
  static async search(req, res) {
    try {
      let limit;

      // finds the query parmeter
      const query = await ArticleController.buildSearchQuery(req.body);
      // limits are not a part of query, thus handled separately
      if (req.body.hasOwnProperty("limit")) {
        limit = Number(req.body.limit);
      }

      // access the database and retrieve the matching articles
      const matchingArticles = await ArticlesAccessor.searchArticles(query, limit);
      res.status(200).json(matchingArticles);
    } catch (e) {
      if (e instanceof HttpError) {
        e.throwHttp(req, res);
      } else {
        new ErrorUnexpected(e.message).throwHttp(req, res);
      }
    }
  }
}
