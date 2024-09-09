import ArticlesAccessor from "../databaseAccessors/articleAccessor.js";
import UsersAccessor from "../databaseAccessors/userAccessor.js";
import Authorize from "../auth/authorization.js";
import { InternalCommentCreate } from "../models/apiModels/internalComment.js";
import { ArticleUpdate, ArticleResponse } from "../models/apiModels/article.js";
import { ErrorArticleNotFound, ErrorUnexpected, HttpError } from "../error/errors.js";

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
      const authorIds = await UsersAccessor.getUserIdsByUsernames(updates.authors);
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
      const username = Authorize.getUsername(req);
      const user = await UsersAccessor.getUserByUsername(username);
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
      console.log("Query1: " + req.query.search);
      const query = { query: req.query.search };

      console.log("Query: " + query.query);

      const results = await ArticlesAccessor.searchArticles(req.query.search, "title");

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
      const { query } = req.query.search || "";
      const titleResults = await ArticlesAccessor.searchArticles(query, "title");
      const contentResults = await ArticlesAccessor.searchArticles(query, "content");

      // merge the two lists
      const combinedResults = [...titleResults, ...contentResults];

      // Use a Map to remove duplicates, and retain the max score for that article
      const resultMap = new Map();

      combinedResults.forEach((result) => {
        // use _id for key
        const id = result._id.toString();

        // if article is already in map
        if (resultMap.has(id)) {
          // compare scores, keep higher one
          const existingResult = resultMap.get(id);
          if (result.score > existingResult.score) {
            resultMap.set(id, result);
          }
        } else {
          // add article for the first time
          resultMap.set(id, result);
        }
      });

      const finalResults = Array.from(resultMap.values());

      res.status(200).json(finalResults);
    } catch (e) {
      if (e instanceof HttpError) {
        e.throwHttp(req, res);
      } else {
        new ErrorUnexpected(e.message).throwHttp(req, res);
      }
    }
  }
}
