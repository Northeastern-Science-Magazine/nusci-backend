import { ErrorValidation } from "../../error/errors.js";

export default class ArticleContent {
  static BodyParagraph = new ArticleContent("body_paragraph");
  static PullQuote = new ArticleContent("pull_quote");
  static Image = new ArticleContent("image");
  static Link = new ArticleContent("link");

  /**
   * INTERNAL USE ONLY
   *
   * Constrict an ArticleContent enum
   *
   * @param {String} type
   */
  constructor(type) {
    this.type = type;
  }

  /**
   * ArticleContent to its associated string
   *
   * @returns {String}
   */
  toString() {
    return this.type;
  }

  /**
   * String to its associated ArticleContent object
   *
   * @param {String} str
   * @returns {ArticleContent}
   */
  static toArticleContent(str) {
    const articleContent = this.list().find((obj) => obj.toString() === str.toLowerCase());
    if (!articleContent) {
      throw new ErrorValidation("Invalid Article Content enum given.");
    }
    return articleContent;
  }

  /**
   * Returns all ArticleContent objects as a list.
   *
   * @returns {List[ArticleContent]}
   */
  static list() {
    return Object.values(this);
  }

  /**
   * Returns all ArticleContent as a list of strings
   */
  static listr() {
    return Object.values(this).map((val) => val.toString());
  }
}
