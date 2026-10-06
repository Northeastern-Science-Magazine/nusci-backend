import IssueMapAccessor from "../databaseAccessors/issueMapAccessor.js";
import {
  ErrorInvalidRequestBody,
  ErrorUnexpected,
  HttpError,
  ErrorSectionNotFound,
  ErrorIssueMapNotFound,
  ErrorValidation,
  ErrorDuplicateKey,
  ErrorUserNotFound,
  ErrorIssueMapNotEmpty,
} from "../error/errors.js";
import ArticleStatus from "../models/enums/articleStatus.js";
import DesignStatus from "../models/enums/designStatus.js";
import PhotographyStatus from "../models/enums/photographyStatus.js";
import WritingStatus from "../models/enums/writingStatus.js";
import Article from "../models/dbModels/article.js";
import ArticlesAccessor from "../databaseAccessors/articleAccessor.js";
import UsersAccessor from "../databaseAccessors/userAccessor.js";
import Authorize from "../auth/authorization.js";
import { IssueMapCreate, IssueMapUpdate } from "../models/zodSchemas/issueMap.js";

/**
 * IssueMapController Class
 *
 * This class controls the behaviour of any web request
 * related to IssueMaps.
 */

export default class IssueMapController {
  /**
   * method to create a new, empty issue map.
   *
   * The creating user is taken from the logged in user's token.
   *
   * @param {Request} req
   * @param {Response} res
   */
  static async create(req, res) {
    try {
      const parsedIssue = await IssueMapCreate.safeParseAsync(req.body);
      if (!parsedIssue.success) {
        throw new ErrorValidation(
          "Issue number must be a positive whole number, issue name is required, and pages must be a non-negative whole number."
        );
      }

      const { issueNumber, issueName, pages } = parsedIssue.data;

      if (await IssueMapAccessor.getIssueMapByIssueNumber(issueNumber)) {
        throw new ErrorDuplicateKey(`Issue #${issueNumber} already exists.`);
      }
      if (await IssueMapAccessor.getIssueByName(issueName)) {
        throw new ErrorDuplicateKey(`An issue named "${issueName}" already exists.`);
      }

      const creatingUser = await UsersAccessor.getUserByEmail(Authorize.getEmail(req));
      if (!creatingUser) {
        throw new ErrorUserNotFound();
      }

      const now = new Date();
      const newIssue = await IssueMapAccessor.createIssue({
        issueNumber,
        issueName,
        pages,
        sections: [],
        articles: [],
        creatingUser: creatingUser._id,
        creationTime: now,
        modificationTime: now,
      });

      res.status(201).json(IssueMapController.toSummary(newIssue));
    } catch (e) {
      if (e instanceof HttpError) {
        e.throwHttp(req, res);
      } else if (e?.code === 11000) {
        // lost a race with a concurrent create using the same number or name
        new ErrorDuplicateKey("An issue with that number or name already exists.").throwHttp(req, res);
      } else {
        new ErrorUnexpected(e.message).throwHttp(req, res);
      }
    }
  }

  /**
   * method to update an issue map's number, name, or page count.
   *
   * @param {Request} req
   * @param {Response} res
   */
  static async update(req, res) {
    try {
      const issueNumber = IssueMapController.parseIssueNumber(req.params.issueNumber);
      const parsedUpdate = await IssueMapUpdate.safeParseAsync(req.body);
      if (!parsedUpdate.success) {
        throw new ErrorValidation(
          "Issue number must be a positive whole number, issue name cannot be blank, and pages must be a non-negative whole number."
        );
      }

      const updates = parsedUpdate.data;

      const existingIssue = await IssueMapAccessor.getIssueMapByIssueNumber(issueNumber);
      if (!existingIssue) {
        throw new ErrorIssueMapNotFound(`Issue #${issueNumber} does not exist.`);
      }

      if (updates.issueNumber !== undefined && updates.issueNumber !== issueNumber) {
        if (await IssueMapAccessor.getIssueMapByIssueNumber(updates.issueNumber)) {
          throw new ErrorDuplicateKey(`Issue #${updates.issueNumber} already exists.`);
        }
      }
      if (updates.issueName !== undefined && updates.issueName !== existingIssue.issueName) {
        if (await IssueMapAccessor.getIssueByName(updates.issueName)) {
          throw new ErrorDuplicateKey(`An issue named "${updates.issueName}" already exists.`);
        }
      }

      const updatedIssue = await IssueMapAccessor.updateIssue(issueNumber, updates);
      res.status(200).json(IssueMapController.toSummary(updatedIssue));
    } catch (e) {
      if (e instanceof HttpError) {
        e.throwHttp(req, res);
      } else if (e?.code === 11000) {
        new ErrorDuplicateKey("An issue with that number or name already exists.").throwHttp(req, res);
      } else {
        new ErrorUnexpected(e.message).throwHttp(req, res);
      }
    }
  }

  /**
   * method to delete an issue map. Issues that still contain articles
   * cannot be deleted, so articles are never left pointing at a missing issue.
   *
   * @param {Request} req
   * @param {Response} res
   */
  static async delete(req, res) {
    try {
      const issueNumber = IssueMapController.parseIssueNumber(req.params.issueNumber);

      const issue = await IssueMapAccessor.getIssueMapByIssueNumber(issueNumber);
      if (!issue) {
        throw new ErrorIssueMapNotFound(`Issue #${issueNumber} does not exist.`);
      }

      const articleCount = new Set([
        ...issue.articles.map(String),
        ...issue.sections.flatMap((section) => section.articles.map(String)),
      ]).size;
      if (articleCount > 0) {
        throw new ErrorIssueMapNotEmpty(
          `Issue #${issueNumber} still contains ${articleCount} article${articleCount === 1 ? "" : "s"}. Remove them before deleting the issue.`
        );
      }

      await IssueMapAccessor.deleteIssue(issueNumber);
      res.status(200).json(IssueMapController.toSummary(issue));
    } catch (e) {
      if (e instanceof HttpError) {
        e.throwHttp(req, res);
      } else {
        new ErrorUnexpected(e.message).throwHttp(req, res);
      }
    }
  }

  /**
   * method to list all issue maps, newest issue number first.
   *
   * @param {Request} req
   * @param {Response} res
   */
  static async getAllIssues(req, res) {
    try {
      const issues = await IssueMapAccessor.getAllIssues();
      const summaries = issues.map(IssueMapController.toSummary).sort((a, b) => b.issueNumber - a.issueNumber);
      res.status(200).json(summaries);
    } catch (e) {
      if (e instanceof HttpError) {
        e.throwHttp(req, res);
      } else {
        new ErrorUnexpected(e.message).throwHttp(req, res);
      }
    }
  }

  static parseIssueNumber(param) {
    const issueNumber = Number(param);
    if (!Number.isInteger(issueNumber) || issueNumber <= 0) {
      throw new ErrorValidation("Issue number must be a positive whole number.");
    }
    return issueNumber;
  }

  static toSummary(issue) {
    return {
      issueNumber: issue.issueNumber,
      issueName: issue.issueName,
      pages: issue.pages,
      creationTime: issue.creationTime,
    };
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
        const users = await UsersAccessor.getUsersByEmails(emails);
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
