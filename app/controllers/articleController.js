import ArticlesAccessor from "../databaseAccessors/articleAccessor.js";
import IssueMapAccessor from "../databaseAccessors/issueMapAccessor.js";
import UsersAccessor from "../databaseAccessors/userAccessor.js";
import Authorize from "../auth/authorization.js";
import Accounts from "../models/enums/accounts.js";
import { InternalComment, InternalCommentResolve } from "../models/zodSchemas/internalComment.js";
import {
  ArticleUpdate,
  ArticleEdit,
  ArticleResponse,
  ArticlePublicListResponse,
  ArticleSearchRequest,
  Article,
} from "../models/zodSchemas/article.js";
import {
  ErrorArticleNotFound,
  ErrorDuplicateKey,
  ErrorIssueMapNotFound,
  ErrorUnexpected,
  HttpError,
  ErrorValidation,
} from "../error/errors.js";
import Utils from "./utils.js";

/**
 * ArticleController Class
 *
 * This class controls the behaviour of any web request
 * related to Articles.
 */
export default class ArticleController {
  /**
   * createArticle method
   *
   * Handles the request to create an article. The authors, editors,
   * photographers, and designers are given as emails; each must belong
   * to an existing user with the matching role, and is stored as that
   * user's ID.
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

      const articleData = parsedArticle.data;

      // converts each list of emails into user IDs, throws before anything is written
      const referenceFields = [
        ["authors", Accounts.Author],
        ["editors", Accounts.Editor],
        ["photographers", Accounts.Photographer],
        ["designers", Accounts.Designer],
      ];
      for (const [field, role] of referenceFields) {
        if (articleData[field]) {
          articleData[field] = await Utils.getUserIdsByEmailsWithRole(articleData[field], role, field);
        }
      }

      let newArticle;
      try {
        newArticle = await ArticlesAccessor.createArticle(articleData);
      } catch (e) {
        // duplicate key, the slug is the only unique field on an article
        if (e?.code === 11000) {
          throw new ErrorDuplicateKey(`An article with the slug "${articleData.slug}" already exists.`);
        }
        if (e?.name === "ValidationError") {
          throw new ErrorValidation(e.message);
        }
        throw e;
      }

      const articleResponse = await ArticleResponse.safeParseAsync(newArticle.toObject());
      if (!articleResponse.success) {
        throw new ErrorValidation("Outgoing response validation failed");
      }

      res.status(201).json(articleResponse.data);
    } catch (e) {
      if (e instanceof HttpError) {
        e.throwHttp(req, res);
      } else {
        new ErrorUnexpected(e.message).throwHttp(req, res);
      }
    }
  }

  /**
   * getPublishedCount method
   *
   * Handles the request to get the number of published
   * (print or online) articles. Public.
   *
   * @param {Request} req
   * @param {Response} res
   */
  static async getPublishedCount(req, res) {
    try {
      const count = await ArticlesAccessor.countPublishedArticles();
      res.status(200).json({ count });
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

      /** Will eventually need to do validation */
      // // Validate and construct an ArticleResponse instance
      // const articleResponse = await ArticleResponse.safeParseAsync(article.toObject());
      // if (!articleResponse.success) {
      //   throw new ErrorValidation("Outgoing response validation failed");
      // }

      // Send the validated ArticleResponse

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
   * deleteArticle method
   *
   * Handles the request to delete an article by its slug.
   * The article is also removed from every issue map that
   * references it, both from the issue's article list and
   * from its sections. Admin only (see the route).
   *
   * @param {Request} req
   * @param {Response} res
   */
  static async deleteArticle(req, res) {
    try {
      const { articleSlug } = req.params;

      const article = await ArticlesAccessor.getArticleBySlug(articleSlug);

      if (!article) {
        throw new ErrorArticleNotFound();
      }

      await ArticlesAccessor.deleteArticleBySlug(articleSlug);
      await IssueMapAccessor.removeArticleFromAllIssues(article._id);

      res.status(204).send();
    } catch (e) {
      if (e instanceof HttpError) {
        e.throwHttp(req, res);
      } else {
        new ErrorUnexpected(e.message).throwHttp(req, res);
      }
    }
  }

  /**
   * editArticle method
   *
   * Handles the request to edit an article from the article edit page.
   * Any subset of title, content, authors, categories, sources, and
   * issue number can be changed in one request. The slug is intentionally
   * left unchanged so that existing links to the article do not break.
   *
   * @param {Request} req
   * @param {Response} res
   */
  static async editArticle(req, res) {
    try {
      const { slug } = req.params;

      const edit = await ArticleEdit.safeParseAsync(req.body);

      if (!edit.success) {
        throw new ErrorValidation("Incoming edit validation failed");
      }

      const { issueNumber, ...fields } = edit.data;

      // converts the given author emails into user IDs, throws before anything is written
      if (fields.authors) {
        fields.authors = await Utils.getUserIdsByEmails(fields.authors);
      }

      // throws if the article or the issue map does not exist, before anything is written
      if (!(await ArticlesAccessor.getArticleBySlug(slug))) {
        throw new ErrorArticleNotFound();
      }
      if (issueNumber !== undefined && !(await IssueMapAccessor.getIssueMapByIssueNumber(issueNumber))) {
        throw new ErrorIssueMapNotFound();
      }

      // the fields and issue number are saved together in one write, with one modification time
      const updatedArticleData = await ArticlesAccessor.updateArticle(slug, {
        ...fields,
        ...(issueNumber !== undefined && { issueNumber }),
        modificationTime: new Date(),
      });

      if (!updatedArticleData) {
        throw new ErrorArticleNotFound();
      }

      // the article already has its new issue number, so only the issue maps are updated here
      if (issueNumber !== undefined) {
        await IssueMapAccessor.moveArticleToIssue(issueNumber, slug, { syncArticle: false });
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

      // const updates = new ArticleUpdate(req.body);

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

      const comment = await InternalComment.safeParseAsync({ user: userID, comment: req.body.comment });
      if (!comment.success) {
        throw new ErrorValidation("Comment creation validation failed.");
      }

      // modify the article with the new comment
      const updatedArticle = await ArticlesAccessor.addCommentBySlug(req.params.slug, comment.data);

      if (!updatedArticle) {
        throw new ErrorArticleNotFound();
      }

      const finalArticle = await ArticleResponse.safeParseAsync(updatedArticle.toObject());
      if (!finalArticle.success) {
        throw new ErrorValidation("Outgoing response validation failed");
      }

      //return updated article with new comment
      res.status(201).json(finalArticle.data);
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
      const resolve = await InternalCommentResolve.safeParseAsync(req.body);
      if (!resolve.success) {
        throw new ErrorValidation("Comment resolve validation failed.");
      }

      // modify the comment status
      const a = await ArticlesAccessor.resolveCommentById(resolve.data.commentId);
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
   * - issueNumber: number (optional, positive integer, filters to one issue)
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

      const { limit, skip, textQuery, categories, issueNumber, sortBy } = validationResult.data;
      const sortOrder = sortBy === "asc" ? 1 : -1;

      // Build query object for non-text search filters
      const query = {};
      if (categories && categories.length > 0) {
        query.categories = { $in: categories };
      }
      if (issueNumber) {
        query.issueNumber = issueNumber;
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

      // Strip sensitive fields (e.g. password) from results before sending
      const validateArticleResponse = await ArticlePublicListResponse.safeParseAsync(searchResult.results);
      if (!validateArticleResponse.success) {
        throw new ErrorValidation("Search response validation failed");
      }

      // Return results with total count for pagination
      res.status(200).json({
        results: validateArticleResponse.data,
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
