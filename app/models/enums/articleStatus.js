import { ErrorValidation } from "../../error/errors.js";

/**
 * Enumerated Class for Article Statuses
 */
export default class ArticleStatus {
  static Pending = new ArticleStatus("pending");
  static Print = new ArticleStatus("print");
  static Online = new ArticleStatus("online");
  static Cancel = new ArticleStatus("cancel");

  /**
   * INTERNAL USE ONLY
   * Constrct an ArticleStatus enum
   *
   * @param {String} status
   */
  constructor(status) {
    this.status = status;
  }

  toString() {
    return this.status;
  }

  /**
   * String to its associated ArticleStatus object
   *
   * @param {String} str
   * @returns {ArticleStatus}
   */
  static toArticleStatus(str) {
    switch (str.toLowerCase()) {
      case this.Pending.toString():
        return this.Pending;
      case this.Print.toString():
        return this.Print;
      case this.Online.toString():
        return this.Online;
      default:
        throw new ErrorValidation("Invalid ArticleStatus enum given.");
    }
  }

  /**
   * Returns all ArticleStatus objects as a list.
   *
   * @returns {List[ArticleStatus]}
   */
  static list() {
    return Object.values(this);
  }

  /**
   * Returns all ArticleStatus as a list of strings
   */
  static listr() {
    return Object.values(this).map((val) => val.toString());
  }
}
