import Authorize from "../auth/authorization.js";
import ArticlesAccessor from "../databaseAccessors/articleAccessor.js";
import UsersAccessor from "../databaseAccessors/userAccessor.js";
import { ErrorArticleNotFound, ErrorTypeOfQuery, ErrorUnexpected, ErrorValidation, HttpError } from "../error/errors.js";
import { ArticleResponse, ArticleUpdate } from "../models/zodSchemas/article.js";
import Utils from "./utils.js";

/**
 * ArticleController Class
 *
 * This class controls the behaviour of any web request
 * related to Articles.
 */
export default class ArticleController {
  /**
   *
   *
   * @param {Request} req
   * @param {Response} res
   */
  static async createArticle(req, res) {
    try {
      const parsedArticle = await Article.safeParseAsync(req.body);
      if (!parsedArticle.success) {
        throw new ErrorValidation(
          `Malformed article data on submission. Error: \n\n ${JSON.stringify(parsedArticle, null, 2)}`
        );
      }
      const newArticle = await ArticlesAccessor.createArticle(parsedArticle.data);
    } catch (e) {
      if (e instanceof HttpError) {
        e.throwHttp(req, res);
      } else {
        new ErrorUnexpected(e.message).throwHttp(req, res);
      }
    }
  }

  /**
   * getArticleBySlug method
   *
   * Handles the request to get a single article by its slug.
   *
   * @param {Request} req
   * @param {Response} res
   */
  static async getArticleBySlug(req, res) {
    try {
      const { slug } = req.params;

      const article = await ArticlesAccessor.getArticleBySlug(slug);

      if (!article) {
        throw new ErrorArticleNotFound();
      }

      // Validate and construct an ArticleResponse instance
      // const articleResponse = await ArticleResponse.safeParseAsync(article.toObject());
      // if (!articleResponse.success) {
      //   throw new ErrorValidation("Outgoing response validation failed");
      // }

      // Send the validated ArticleResponse

      console.log(article);
      res.status(200).json(article);
    } catch (e) {
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
      
      const updates = await ArticleUpdate.safeParseAsync(req.body);

      if (!updates.success) {
        throw new ErrorValidation("Incoming update validation failed");
      }

      const updatedArticleData = await ArticlesAccessor.updateArticle(slug, updates.data);

      if (!updatedArticleData) {
        throw new ErrorArticleNotFound();
      }

      const updatedArticleResponse = await ArticleResponse.safeParseAsync(updatedArticleData.toObject());
      if (!updatedArticleResponse.success) {
        throw new ErrorValidation("Outgoing response validation failed");
      }

      // Send the validated ArticleResponse
      res.status(200).json(updatedArticleResponse.data);
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

      const updates = await ArticleUpdate.safeParseAsync(req.body);

      if (!updates.success) {
        throw new ErrorValidation("Validation failed.");
      }

      const authorIds = await Utils.getUserIdsByEmails(updates.data.authors);
      updates.data.authors = authorIds;
      const updatedArticleData = await ArticlesAccessor.updateArticle(slug, updates.data);

      if (!updatedArticleData) {
        throw new ErrorArticleNotFound();
      }

      // Validate and construct an ArticleResponse instance
      const updatedArticleObj = updatedArticleData.toObject();
      const updatedArticleResponse = ArticleResponse.safeParse(updatedArticleData.toObject());
      if (!updatedArticleResponse.success) {
          throw new ErrorValidation("ArticleResponse creation failed.")
      }

      res.status(200).json(updatedArticleResponse.data);
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

      const comment = InternalComment.safeParse({user: userID, comment: req.body.comment });
      if (!comment.success) {
        throw new ErrorValidation("Comment creation validation failed.")
      }

      // modify the article with the new comment
      const updatedArticle = await ArticlesAccessor.addCommentBySlug(req.params.slug, comment.data);

      if (!updatedArticle) {
        throw new ErrorArticleNotFound();
      }

      const finalArticle = ArticleResponse.safeParse(updatedArticle.toObject());
      if (!finalArticle.success) {
        throw new ErrorValidation("Final article response parsing failed.");
      }

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
   * Unified search method that supports both fuzzy text search and regular queries.
   * Supports pagination, category filtering, and date sorting.
   *
   * Expected request body:
   * - limit: number (optional, default: no limit)
   * - skip: number (optional, default: 0)
   * - textQuery: string (optional, triggers fuzzy search if provided)
   * - categories: array of strings (optional, filters by categories)
   * - sortBy: "asc" | "desc" (optional, default: "desc" for newest first)
   *
   * @param {HTTP REQ} req web request object
   * @param {HTTP RES} res web response object
   */
  static async search(req, res) {
    try {
      // Validate request body with Zod schema
      const validationResult = await ArticleSearchRequest.safeParseAsync(req.body || {});

      if (!validationResult.success) {
        throw new ErrorValidation("Search request validation failed");
      }

      const { limit, skip, textQuery, categories, sortBy } = validationResult.data;
      const sortOrder = sortBy === "asc" ? 1 : -1;

      // Build query object for non-text search filters
      const query = {};
      if (categories && categories.length > 0) {
        query.categories = { $in: categories };
      }

      // Perform search - use fuzzy search if textQuery is provided, otherwise regular search
      let searchResult;
      if (textQuery && textQuery.trim().length > 0) {
        // Use fuzzy search with textQuery (results sorted by relevance, not by date)
        searchResult = await ArticlesAccessor.searchArticlesWithText(textQuery.trim(), query, limit, skip);
      } else {
        // Use regular search without text query
        searchResult = await ArticlesAccessor.searchArticles(query, limit, skip, sortOrder);
      }

      // Return results with total count for pagination
      res.status(200).json({
        results: searchResult.results,
        total: searchResult.total,
      });
    } catch (e) {
      if (e instanceof HttpError) {
        e.throwHttp(req, res);
      } else {
        new ErrorUnexpected(e.message).throwHttp(req, res);
      }
    }
  }
}
