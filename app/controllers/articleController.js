import ArticlesAccessor from "../databaseAccessors/articleAccessor.js";
import UsersAccessor from "../databaseAccessors/userAccessor.js";
import Authorize from "../auth/authorization.js";
import { InternalCommentCreate } from "../models/apiModels/internalComment.js";
import { ArticleUpdate, ArticleResponse } from "../models/apiModels/article.js";
import { ErrorArticleNotFound, ErrorUnexpected, HttpError, ErrorTypeOfQuery } from "../error/errors.js";
import Utils from "./utils.js";
import Article from "../models/dbModels/article.js";
import { ArticleCreate } from "../models/apiModels/article.js";
import PhotoTagAccessor from "../databaseAccessors/photoTagAccessor.js";
import { ErrorDuplicateKey } from "../error/errors.js";
/**
 * ArticleController Class
 *
 * This class controls the behaviour of any web request
 * related to Articles.
 */
export default class ArticleController {

  static async createArticle(req, res) {
    console.log("entered create article in controller");
    try {
      const articleCreate = new ArticleCreate(req.body);
      console.log("create article:", articleCreate);
      const articleByID = await ArticlesAccessor.getArticleByTitle(articleCreate.title);
      console.log("duplicate article:", articleByID);
      if (articleByID) {
        throw new ErrorDuplicateKey();
      }
      const newArticle = await ArticlesAccessor.createArticle(articleCreate);
      console.log("new article:", newArticle);
      const populatedArticle = await ArticlesAccessor.getArticle(newArticle._id);
      const newArticleResponse = new ArticleResponse(populatedArticle.toObject);
      res.status(201).json(newArticleResponse);
    }
    catch (e) {
      if (e instanceof HttpError) {
        e.throwHttp(req, res);
      } else {
        new ErrorUnexpected(e.message).throwHttp(req, res);
      }
    }
  }

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
   * Fuzzy searches for articles based on title
   *
   * @param {Request} req
   * @param {Response} res
   */
  static async searchByTitle(req, res) {
    try {
      const search = req.query.search;

      const fields = ["title"];

      var results = await ArticlesAccessor.fuzzySearchArticles(search, fields);

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
   * Fuzzy searches for articles based on title and content
   *
   * @param {Request} req
   * @param {Response} res
   */
  static async searchByTitleAndContent(req, res) {
    try {
      const search = req.query.search;

      const fields = ["title", "articleContent.content"];

      var results = await ArticlesAccessor.fuzzySearchArticles(search, fields);

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
   * search Method
   *
   * This method searches and returns all articles matching the given params
   *
   * @param {HTTP REQ} req web request object
   * @param {HTTP RES} res web response object
   * @param {function} next middleware function
   */
  static async search(req, res) {
    async function getUserIdsByEmailsQuery(listOfEmails) {
      if (!Array.isArray(listOfEmails)) {
        throw new ErrorTypeOfQuery();
      }
      // returns ids of the user objects given as a list of emails
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

    try {
      const query = {};
      var limit;

      for (const searchOption of Object.keys(mapping)) {
        if (req.body.hasOwnProperty(searchOption)) {
          query[searchOption] = await mapping[searchOption](req.body[searchOption]);
        }
      }

      if (req.body.hasOwnProperty("before") && req.body.hasOwnProperty("after")) {
        query.$and = [{ approvalTime: { $gte: req.body.after } }, { approvalTime: { $lte: req.body.before } }];
      } else if (req.body.hasOwnProperty("before")) {
        query.approvalTime = { $lte: req.body.before };
      } else if (req.body.hasOwnProperty("after")) {
        query.approvalTime = { $gte: req.body.after };
      }

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
