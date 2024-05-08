/**
 * Enumerated Class for Design Statuses
 */
export default class DesignStatus {
  static Needs_Designer = new AccountStatus("needs_designer");
  static Has_Designer = new AccountStatus("has_designer");
  static In_Progress = new AccountStatus("in_progress");
  static Completed = new AccountStatus("completed");

  // Get all DesignStatuses
  static list = [this.Needs_Designer, this.Has_Designer, this.In_Progress, this.Completed];
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
  static toDesignStatus(str) {
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
}
