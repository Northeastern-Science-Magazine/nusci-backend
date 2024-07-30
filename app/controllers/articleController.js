import ArticlesAccessor from "../databaseAccessors/articleAccessor.js";
import UsersAccessor from "../databaseAccessors/userAccessor.js";
import Authorize from "../auth/authorization.js";
import { ErrorValidation, ErrorIncorrectUser } from "../error/httpErrors.js";
import {ErrorInternalAPIModelValidation} from "../error/internalErrors.js";
import { InternalCommentCreate } from "../models/apiModels/internalComment.js";
import { ArticleResponse } from "../models/apiModels/article.js";


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
        
            const finalArticle = new ArticleResponse( updatedArticle.toObject() );

            //return updated article with new comment
            res.status(201).json(finalArticle);
        } catch (e) {
            console.log(e);
            //ErrorIncorrectUser.throwHttp(req, res);
            if (e.error == "User is incorrect.'") {
                ErrorIncorrectUser.throwHttp(req, res);
            }
            else if (e.error == "Malformed API Model.") {
                ErrorValidation.throwHttp(req,res);
            }
            else if (e instanceof ErrorInternalAPIModelValidation) {
                // throw e;
                throw new ErrorInternalAPIModelValidation(e);
            }
            else if (e instanceof TypeError) {
                throw new TypeError(e);
            }
            else {
                new throwHttp(req, res);
            }
        }
    }
}
