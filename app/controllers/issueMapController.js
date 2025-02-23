import IssueMapAccessor from "../databaseAccessors/issueMapAccessor.js";
import ArticlesAccessor from "../databaseAccessors/articleAccessor.js";
import UsersAccessor from "../databaseAccessors/userAccessor.js";

import {
  ErrorInvalidRequestBody,
  ErrorUnexpected,
  HttpError,
  ErrorSectionNotFound,
  ErrorIssueMapNotFound,
  ErrorTypeOfQuery,
} from "../error/errors.js";
import Validate from "../models/validationSchemas/validateSchema.js";
import { issueMapSectionValidationSchema, issueMapValidationSchema } from "../models/validationSchemas/issueMap.js";
 
import Authorize from "../auth/authorization.js";
import ArticleStatus from "../models/enums/articleStatus.js";
import DesignStatus from "../models/enums/designStatus.js";
import PhotographyStatus from "../models/enums/photographyStatus.js";
import WritingStatus from "../models/enums/writingStatus.js";

// deprecated import?
import Article from "../models/dbModels/article.js";

/**
 * IssueMapController Class
 *
 * This class controls the behaviour of any web request
 * related to IssueMaps.
 */
export default class IssueMapController {

  /**
   * Creates an issue map. Receives a request with issue number, issue name, number of pages, and sections (optional)
   * @param {Request} req
   * @param {Response} res
   */
  static async createIssueMap(req, res) {
    try {
      Validate.incoming(
        req.body, 
        issueMapValidationSchema,
        { override: ["creationTime", "modificationTime"] }
      );

      const currentUserID = await UsersAccessor.getUserIdByEmail(Authorize.getEmail(req));

      // Manually adding creation/modificationTime seems redundant, given the validate above
      // is there an easier way to do this?
      var sectionArray = (!req.body.sections) ? [] : req.body.sections.map((section) => ({
        ...section,
        creatingUser: currentUserID
      }));
      
      const newIssueMapBody = {
        ...req.body,
        sections: sectionArray, 
        creatingUser: currentUserID,
      }
      console.log(`New body:\n ${JSON.stringify(newIssueMapBody, null, 2)}`);
      const postedIssueMap = await IssueMapAccessor.postCreateIssueMap(newIssueMapBody);

     // What should be returned to the frontend? Need this info to create the validation schema!
      
      res.status(201).json(postedIssueMap);
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
   * method to create and add an article from the issue map.
   *
   * Create and add an article from the issue map.
   *
   * @param {Request} req
   * @param {Response} res
   */
  static async addAndCreateArticle(req, res) {
    try {
      const {
        articleSlug,
        issueNumber,
        pageLength,
        authors = [],
        editors = [],
        designers = [],
        photographers = [],
        section = "",
        categories = [],
      } = req.body;

      const existingArticle = await ArticlesAccessor.getArticleBySlug(articleSlug);
      if (issueNumber < 0 || !articleSlug || pageLength < 0 || existingArticle) {
        throw new ErrorInvalidRequestBody();
      }

      const articleStatus = ArticleStatus.Print;
      const designStatus = designers.length > 0 ? DesignStatus.Has_Designer : DesignStatus.Needs_Designer;
      const photographyStatus =
        photographers.length > 0 ? PhotographyStatus.Photographer_Assigned : PhotographyStatus.Needs_Photographer;
      const writingStatus = editors.length > 0 ? WritingStatus.Has_Editor : WritingStatus.Needs_Editor;

      const fetchUsers = async (emails, role) => {
        const users = await UsersAccessor.getUsersByEmail(emails);
        if (users.length !== emails.length) {
          throw new ErrorInvalidRequestBody(`Invalid ${role} emails`);
        }
        return users;
      };

      const authorUsers = await fetchUsers(authors, "authors");
      const editorUsers = await fetchUsers(editors, "editors");
      const designerUsers = await fetchUsers(designers, "designers");
      const photographerUsers = await fetchUsers(photographers, "photographers");

      const newArticle = {
        title: articleSlug,
        slug: articleSlug,
        issueNumber,
        pageLength,
        categories,
        articleStatus,
        writingStatus,
        designStatus,
        photographyStatus,
        authors: authorUsers,
        editors: editorUsers,
        designers: designerUsers,
        photographers: photographerUsers,
        ArticleContent: [],
        comments: [],
        sources: [],
        creationTime: new Date(),
        modificationTime: new Date(),
      };

      const createdArticle = await Article.create(newArticle);
      const issueMap = await IssueMapAccessor.getIssueMapByIssueNumber(issueNumber);

      if (!issueMap) {
        throw new ErrorIssueMapNotFound();
      }

      if (section) {
        const sectionIndex = issueMap.sections.findIndex((sec) => sec.sectionName === section);

        if (sectionIndex >= 0) {
          issueMap.sections[sectionIndex].articles.push(createdArticle._id);
        } else {
          throw new ErrorSectionNotFound();
        }
      } else {
        issueMap.articles.push(createdArticle._id);
      }

      issueMap.modificationTime = new Date();
      await issueMap.save();

      return res.status(200).json(issueMap);
    } catch (e) {
      if (e instanceof HttpError) {
        e.throwHttp(req, res);
      } else {
        new ErrorUnexpected(e.message).throwHttp(req, res);
      }
    }
  }

  /**
   * method to delete an article from the issue map.
   *
   * Deletes an article from the issue map.
   *
   * @param {Request} req
   * @param {Response} res
   */
  static async removeArticle(req, res) {
    try {
      const issueNumber = req.body.issueNumber;
      const articleSlug = req.body.articleSlug;

      if (!issueNumber || !articleSlug) {
        throw new ErrorInvalidRequestBody();
      }

      const updatedIssue = await IssueMapAccessor.removeArticleFromIssue(issueNumber, articleSlug);
      res.status(200).json(updatedIssue);
    } catch (e) {
      if (e instanceof HttpError) {
        e.throwHttp(req, res);
      } else {
        new ErrorUnexpected(e.message).throwHttp(req, res);
      }
    }
  }

}
