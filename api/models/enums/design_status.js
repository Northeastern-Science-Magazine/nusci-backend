export default class DesignStatus {
  static Needs_Designer = new AccountStatus("needs_designer");
  static Has_Designer = new AccountStatus("has_designer");
  static In_Progress = new AccountStatus("in_progress");
  static Completed = new AccountStatus("completed");

  /**
 static enum verification method
 * @param {String} str
 */
  static toAccountStatus(str) {
    switch (str.toLowerCase()) {
      case "needs_designer":
        return this.Needs_Designer;
      case "has_designer":
        return this.Has_Designer;
      case "in_progress":
        return this.In_Progress;
      case "completed":
        return this.Completed;
      default:

    }
  }
};