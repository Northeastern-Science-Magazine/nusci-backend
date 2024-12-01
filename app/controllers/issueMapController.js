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
import IssueMap from "../models/dbModels/article.js";
import ArticlesAccessor from "../databaseAccessors/articleAccessor.js";
import UsersAccessor from "../databaseAccessors/userAccessor.js";

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
      console.log("Request Body:", req.body);
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
      console.log("Article Created:", createdArticle);

      const issueMap = await IssueMapAccessor.getIssueMapByIssueNumber(issueNumber);

      if (!issueMap) {
        console.error(`Issue Map for issueNumber ${issueNumber} not found.`);
        throw new ErrorIssueMapNotFound();
      }

      console.log("Fetched Issue Map:", issueMap);

      if (section) {
        const sectionIndex = issueMap.sections.findIndex((sec) => sec.sectionName === section);

        if (sectionIndex >= 0) {
          issueMap.sections[sectionIndex].articles.push(createdArticle._id);
        } else {
          console.error("Section Not Found");
          throw new ErrorSectionNotFound();
        }
      } else {
        issueMap.articles.push(createdArticle._id);
      }

      issueMap.modificationTime = new Date();
      await issueMap.save();

      console.log("Issue Map Updated and Saved");
      return res.status(200).json(issueMap);
    } catch (e) {
      console.error("Error Occurred:", e.message);
      if (e instanceof HttpError) {
        e.throwHttp(req, res);
      } else {
        new ErrorUnexpected(e.message).throwHttp(req, res);
      }
    }
  }
}
