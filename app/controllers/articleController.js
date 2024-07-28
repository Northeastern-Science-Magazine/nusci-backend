dotenvConfig(); // load .env variables
import { config as dotenvConfig } from "dotenv";
import ArticleAccessor from "../databaseAccessors/articleAccessor.js";
import UserAccessor from "../databaseAccessors/userAccessor.js";
import bcrypt from "bcryptjs"; // import bcrypt to hash passwords
import jwt from "jsonwebtoken"; // import jwt to sign tokens
import Authorize from "../auth/authorization.js";
import { ArticleUpdate, ArticleResponse } from "../models/apiModels/article.js";
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

      const updates = new ArticleUpdate(req.body);

      //const updatesData = JSON.stringify(updates);
      const updatedArticleData = await ArticleAccessor.updateArticle(slug, updates);

      // Validate and construct an ArticleResponse instance
      const updatedArticleResponse = new ArticleResponse(updatedArticleData); // Code breaks here :("

      // Send the validated ArticleResponse
      res.status(200).json(updatedArticleResponse);
    } catch (e) {
      console.log("ERROR: " + e.message);
      res.status(400).json({ error: e.message });
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

      const updatedArticle = await ArticleAccessor.updateArticle(slug, updates);
      res.status(200).json(updatedArticle);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }
}
