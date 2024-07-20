dotenvConfig(); // load .env variables
import { config as dotenvConfig } from "dotenv";
import ArticleAccessor from "../databaseAccessors/articleAccessor.js";
import bcrypt from "bcryptjs"; // import bcrypt to hash passwords
import jwt from "jsonwebtoken"; // import jwt to sign tokens
import Authorize from "../auth/authorization.js";
import { UserCreate, UserPublicResponse, UserResponse } from "../models/apiModels/user.js";
import {
  ErrorWrongPassword,
  ErrorUserLoggedIn,
  ErrorUserNotFound,
  ErrorUserNotRegistered,
  ErrorUserAlreadyExists,
  ErrorValidation,
} from "../error/httpErrors.js";

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
      const { status } = req.body;

      if (!status) {
        throw new ErrorInternalAPIModelFieldValidation("Status is required");
      }

      const updatedArticle = await ArticleAccessor.updateArticle(slug, { articleStatus: status });
      res.json(updatedArticle);
    } catch (e) {
      res.status(500).json({ error: e.message });
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
      const { authors } = req.body;

      if (!Array.isArray(authors) || authors.length === 0) {
        throw new ErrorInternalAPIModelFieldValidation("Authors list is required and must be a non-empty array");
      }

      const updatedArticle = await ArticleAccessor.updateArticle(slug, { authors: authors });
      res.json(updatedArticle);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }
}
