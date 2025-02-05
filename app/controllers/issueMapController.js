import IssueMapAccessor from "../databaseAccessors/issueMapAccessor.js";
import {
  ErrorInvalidRequestBody,
  ErrorUnexpected,
  HttpError,
  ErrorSectionNotFound,
  ErrorIssueMapNotFound,
} from "../error/errors.js";
import ArticleStatus from "../models/enums/articleStatus.js";
import DesignStatus from "../models/enums/designStatus.js";
import PhotographyStatus from "../models/enums/photographyStatus.js";
import WritingStatus from "../models/enums/writingStatus.js";
import Article from "../models/dbModels/article.js";
import ArticlesAccessor from "../databaseAccessors/articleAccessor.js";
import UsersAccessor from "../databaseAccessors/userAccessor.js";

/**
 * IssueMapController Class
 *
 * This class controls the behavior of any web request
 * related to IssueMaps.
 */

export default class IssueMapController {
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

  /**
   * method to remove section from the issue map.
   *
   * @param {Request} req
   * @param {Response} res
   */
  static async patchSection(req, res) {
    try {
      const issueNumber = req.body.issueNumber;
      const sectionName = req.body.sectionName;
      const sectionColor = req.body.sectionColor;

      if (!sectionName || !sectionColor) {
        throw new ErrorInvalidRequestBody();
      }

      const updatedIssue = await IssueMapAccessor.removeSection(issueNumber, sectionName, sectionColor);

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
