import ArticlesAccessor from "../databaseAccessors/articleAccessor.js";
import IssueMapAccessor from "../databaseAccessors/issueMapAccessor.js";
import UsersAccessor from "../databaseAccessors/userAccessor.js";
import {
  ErrorInvalidRequestBody,
  ErrorIssueMapNotFound,
  ErrorSectionNotFound,
  ErrorUnexpected,
  ErrorValidation,
  HttpError,
} from "../error/errors.js";
import Article from "../models/dbModels/article.js";
import ArticleStatus from "../models/enums/articleStatus.js";
import DesignStatus from "../models/enums/designStatus.js";
import PhotographyStatus from "../models/enums/photographyStatus.js";
import WritingStatus from "../models/enums/writingStatus.js";
import { ArticleCreate } from "../models/zodSchemas/article.js";
import { IssueMapResponse } from "../models/zodSchemas/issueMap.js";

/**
 * IssueMapController Class
 *
 * This class controls the behaviour of any web request
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
      const article = await ArticleCreate.safeParseAsync(req.body);
      if (!article.success) {
        throw new ErrorInvalidRequestBody("Incoming article request validation failed.");
      }

      const existingArticle = await ArticlesAccessor.getArticleBySlug(req.body.slug);
      if (existingArticle) {
        throw new ErrorInvalidRequestBody(`An article with slug ${slug} already exists.`);
      }

      const {
        articleSlug,
        issueNumber,
        pageLength,
        authors,
        editors,
        designers,
        photographers,
        section,
        categories,
      } = article.data;

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


      // article creation object to be sent directly to database
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

      // issuemap return is insane
      issueMap.modificationTime = new Date();
      await issueMap.save();

      
      return res.status(200).json(issueMap.toJSON());
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

      const updatedIssueResponse = IssueMapResponse.safeParse(updatedIssue);
      if (!updatedIssueResponse.success) {
        throw new ErrorValidation("Issue map response validation failed.");
      }

      res.status(200).json(updatedIssueResponse.data);
    } catch (e) {
      if (e instanceof HttpError) {
        e.throwHttp(req, res);
      } else {
        new ErrorUnexpected(e.message).throwHttp(req, res);
      }
    }
  }
}
