dotenvConfig(); // load .env variables
import { config as dotenvConfig } from "dotenv";
import ArticleAccessor from "../databaseAccessors/articleAccessor.js";
import UserAccessor from "../databaseAccessors/userAccessor.js";
import { ArticleUpdate, ArticleResponse } from "../models/apiModels/article.js";
import { ErrorUnexpected, ErrorDatabaseConnection, ErrorArticleNotFound, ErrorUserNotFound } from "../error/httpErrors.js";
import {
  ErrorInternalDatabaseConnection,
  ErrorInternalArticleNotFound,
  ErrorInternalUserNotFound,
} from "../error/internalErrors.js";

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

      const updatedArticleData = await ArticleAccessor.updateArticle(slug, updates);

      // Validate and construct an ArticleResponse instance
      const updatedArticleResponse = new ArticleResponse(updatedArticleData.toObject());

      // Send the validated ArticleResponse
      res.status(200).json(updatedArticleResponse);
    } catch (e) {
      // Check if it's a DB connection error
      if (e instanceof ErrorInternalDatabaseConnection) {
        // Throw up the stack
        ErrorDatabaseConnection.throwHttp(req, res);
      } else if (e instanceof ErrorInternalArticleNotFound) {
        ErrorArticleNotFound.throwHttp(req, res);
      } else {
        // Else throw unexpected error
        ErrorUnexpected.throwHttp(req, res);
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

      const authorIds = await UserAccessor.getUserIdsByUsernames(updates.authors);

      updates.authors = authorIds;

      const updatedArticleData = await ArticleAccessor.updateArticle(slug, updates);

      // Validate and construct an ArticleResponse instance
      const updatedArticleResponse = new ArticleResponse(updatedArticleData.toObject());

      res.status(200).json(updatedArticleResponse);
    } catch (e) {
      // Check if it's a DB connection error
      if (e instanceof ErrorInternalDatabaseConnection) {
        // Throw up the stack
        ErrorDatabaseConnection.throwHttp(req, res);
      } else if (e instanceof ErrorInternalUserNotFound) {
        ErrorUserNotFound.throwHttp(req, res);
      } else if (e instanceof ErrorInternalArticleNotFound) {
        ErrorArticleNotFound.throwHttp(req, res);
      } else {
        // Else throw unexpected error
        ErrorUnexpected.throwHttp(req, res);
      }
    }
  }
}
