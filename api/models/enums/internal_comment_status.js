/**
 * Enumerated Class for Internal Comment Statuses
 */
export default class InternalCommentStatus {
  static Resolved = new AccountStatus("resolved");
  static Unresolved = new AccountStatus("unresolved");
  static Public = new AccountStatus("public");

  constructor(status) {
    this.status = status;
  }

  /**
static enum verification method
* @param {String} str
*/
  static toInternalCommentStatus(str) {
    switch (str.toLowerCase()) {
      case "resolved":
        return this.Resolved;
      case "unresolved":
        return this.Unresolved;
      case "public":
        return this.Public;
      default:
    }
  }
}
