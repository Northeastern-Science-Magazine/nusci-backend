import IssueMapAccessor from "../databaseAccessors/issueMapAccessor.js";
import { ErrorInvalidRequestBody, ErrorUnexpected, HttpError, ErrorSectionNotFound, ErrorIssueMapNotFound } from "../error/errors.js";
import { IssueMapUpdate } from "../models/apiModels/issueMap.js";
import { ArticleCreate } from "../models/apiModels/article.js";
import ArticleStatus from "../models/enums/articleStatus.js";
import DesignStatus from "../models/enums/designStatus.js";
import PhotographyStatus from "../models/enums/photographyStatus.js";
import WritingStatus from "../models/enums/writingStatus.js";
import ArticleContent from "../models/enums/articleContent.js";
import Article from "../models/dbModels/article.js";
import IssueMap from "../models/dbModels/article.js";


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
      const{
        articleSlug,
        issueNumber,
        pageLength,
        authors = [],
        editors = [],
        designers = [],
        photographers = [],
        section = null,
        categories = []
      } = req.body

      if (!issueNumber || !articleSlug || !pageLength) {
        throw new ErrorInvalidRequestBody();
      }
      
      const articleStatus = ArticleStatus.Print;
      const designStatus = designers.length > 0 ? DesignStatus.Has_Designer : DesignStatus.Needs_Designer;
      const photographyStatus = photographers.length > 0 ? PhotographyStatus.Photographer_Assigned : PhotographyStatus.Needs_Photographer;
      const writingStatus = editors.length > 0 ? WritingStatus.Has_Editor : WritingStatus.Needs_Editor;

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
        authors,
        editors,
        designers,
        photographers,
        ArticleContent: [],
        comments: [],
        sources: [],
        creationTime: new Date(),
        modificationTime: new Date(),
    };

      const createdArticle = await Article.create(new Article);

      const issueMap = IssueMapAccessor.getIssueMapByIssueNumber(issueNumber);

    if (!issueMap) {
      throw new ErrorIssueMapNotFound();
    }

    if (section) {
      const sectionIndex = issueMap.sections.findIndex(sec => sec.sectionName === section);

      if (sectionIndex >= 0) {
        issueMap.sections[sectionIndex].articles.push(createdArticle._id);
      } else {
        throw new ErrorSectionNotFound();
      }
    } else {
        // if no section provided in the request
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
}
