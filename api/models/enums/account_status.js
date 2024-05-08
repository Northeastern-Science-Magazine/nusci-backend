/**
 * Enumerated Class for Account Statuses
 */
export default class AccountStatus {
  static Pending = new AccountStatus("pending");
  static Deactivated = new AccountStatus("deactivated");
  static Approved = new AccountStatus("approved");

  // Get all AccountStatuses
  static list = [this.Pending, this.Deactivated, this.Approved];
  static listStr = this.list.map((status) => {
    return status.status;
  });

  constructor(status) {
    this.status = status;
  }

  /**
   *
   * @param {String} str
   * @returns {Boolean}
   */
  static toAccountStatus(str) {
    switch (str.toLowerCase()) {
      case "pending":
        return this.Pending;
      case "deactivated":
        return this.Deactivated;
      case "approved":
        return this.Approved;
      default:
    }
  }
}
