/**
 * Enumerated Class for Internal Comment Statuses
 */
export default class InternalCommentStatus {
  static Resolved = new AccountStatus("resolved");
  static Unresolved = new AccountStatus("unresolved");

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
      default:

    }
  }
};