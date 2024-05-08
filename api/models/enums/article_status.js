/**
 * Enumerated Class for Article Statuses
 */
export default class ArticleStatus {
  static Pending = new AccountStatus("pending");
  static Print = new AccountStatus("print");
  static Online = new AccountStatus("online");

  // Get all ArticleStatuses
  static list = [this.Pending, this.Print, this.Online];
  static listStr = this.list.map((status) => {
    return status.status;
  });

  constructor(status) {
    this.status = status;
  }

  /**
 static enum verification method
 * @param {String} str
 */
  static toArticleStatus(str) {
    switch (str.toLowerCase()) {
      case "pending":
        return this.Pending;
      case "print":
        return this.Print;
      case "online":
        return this.Online;
      default:
    }
  }
}
