/**
 * Enumerated Class for Comment Statuses
 */
export default class CommentStatus {
  static Resolved = new CommentStatus("resolved");
  static Unresolved = new CommentStatus("unresolved");
  static Public = new CommentStatus("public");

  // Get all Comment Statuses
  static list = [this.Resolved, this.Unresolved, this.Public];
  static listStr = this.list.map((status) => {
    return status.status;
  });

  /**
   * INTERNAL USE ONLY
   * Construct a CommentStatus enum
   *
   * @param {String} status
   */
  constructor(status) {
    this.status = status;
  }

  /**
   * String to its associated CommentStatus object
   *
   * @param {String} str
   * @returns {CommentStatus}
   */
  static toCommentStatus(str) {
    switch (str.toLowerCase()) {
      case this.Resolved.status:
        return this.Resolved;
      case this.Unresolved.status:
        return this.Unresolved;
      case this.Public.status:
        return this.Public;
      default:
    }
  }
}
