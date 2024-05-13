/**
 * Enumerated Class for Article Statuses
 */
export default class ArticleStatus {
  static Pending = new ArticleStatus("pending");
  static Print = new ArticleStatus("print");
  static Online = new ArticleStatus("online");

  // Get all ArticleStatuses
  static list = [this.Pending, this.Print, this.Online];
  static listStr = this.list.map((status) => {
    return status.status;
  });

  /**
   * INTERNAL USE ONLY
   * Constrct an ArticleStatus enum
   *
   * @param {String} status
   */
  constructor(status) {
    this.status = status;
  }

  /**
   * String to its associated ArticleStatus object
   *
   * @param {String} str
   * @returns {ArticleStatus}
   */
  static toArticleStatus(str) {
    switch (str.toLowerCase()) {
      case this.Pending.status:
        return this.Pending;
      case this.Print.status:
        return this.Print;
      case this.Online.status:
        return this.Online;
      default:
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
