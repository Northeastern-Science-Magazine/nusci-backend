import { ErrorValidation } from "../../error/errors.js";

export default class ArticleContent {
  static BodyParagraph = new ArticleContent("body_paragraph");
  static PullQuote = new ArticleContent("pull_quote");
  static Image = new ArticleContent("image");

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
    switch (str.toLowerCase()) {
      case this.BodyParagraph.type:
        return this.BodyParagraph;
      case this.PullQuote.type:
        return this.PullQuote;
      case this.Image.type:
        return this.Image;
      default:
        throw new ErrorValidation("Invalid ArticleContent enum given.");
    }
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
