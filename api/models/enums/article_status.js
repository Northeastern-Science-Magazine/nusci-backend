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
      case this.Pending.status:
        return this.Pending;
      case this.Print.status:
        return this.Print;
      case this.Online.status:
        return this.Online;
      default:
    }
  }
}
