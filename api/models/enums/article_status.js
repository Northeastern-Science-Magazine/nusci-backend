export default class ArticleStatus {
  static Pending = new AccountStatus("pending");
  static Print = new AccountStatus("print");
  static Online = new AccountStatus("online");

  /**
 static enum verification method
 * @param {String} str
 */
  static toAccountStatus(str) {
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
};
