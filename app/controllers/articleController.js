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
   * search Method
   *
   * This method searches and returns all articles matching the given params
   *
   * @param {HTTP REQ} req web request object
   * @param {HTTP RES} res web response object
   * @param {function} next middleware function
   */
  static async search(req, res, next){
    try {
      const query = {};
      
      if (req.body.hasOwnProperty('issueNumber')===true) {
        query.issueNumber = req.body.issueNumber;
      }
      console.log("print 8:", query);
      if (req.body.hasOwnProperty('authors')===true) {
        query.authors = [];
        for (let i = 0; i < req.body.authors.length; i++) {
          const user = await UsersAccessor.getUserByEmail(req.body.authors[i]);
        }
      }
      if(req.body.hasOwnProperty('editors')) {
        query.editors = [];
        for (let i = 0; i < req.body.editors.length; i++) {
          query.editors[i] = await UsersAccessor.getUserByEmail(req.body.editors[i]);
        }
      }
      if (req.body.hasOwnProperty('designers')) {
        query.designers = [];
        for (let i = 0; i < req.body.designers.length; i++) {
          query.designers[i] = await UsersAccessor.getUserByEmail(req.body.designers[i]);
        }
      }
      if (req.body.hasOwnProperty('photographers')) {
        query.photographers = [];
        for (let i = 0; i < req.body.photographers.length; i++) {
          query.photographers[i] = await UsersAccessor.getUserByEmail(req.body.photographers[i]);
        }
      }
      if (req.body.hasOwnProperty('slug')) {
        query.slug = req.body.slug;
      }
      if (req.body.hasOwnProperty('categories')) {
        query.categories = req.body.categories;
      }
      if (req.body.hasOwnProperty('before')) {
        query.before = req.body.before;
      }
      if (req.body.hasOwnProperty('after')) {
        query.after = req.body.after;
      }

      console.log(query);
      const matchingArticles = await ArticlesAccessor.searchArticles(query); 
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
