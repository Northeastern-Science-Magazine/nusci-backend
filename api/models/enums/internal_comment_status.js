/**
 * Enumerated Class for Comment Statuses
 */
export default class CommentStatus {
  static Resolved = new AccountStatus("resolved");
  static Unresolved = new AccountStatus("unresolved");
  static Public = new AccountStatus("public");

  // Get all CommentStatuses
  static list = [this.Resolved, this.Unresolved, this.Public];
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
  static toCommentStatus(str) {
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
