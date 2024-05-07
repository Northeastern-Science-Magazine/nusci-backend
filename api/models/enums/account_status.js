/**
 * Enumerated Class for Account Statuses
 */
export default class AccountStatus {
  static Pending = new AccountStatus("pending");
  static Deactivated = new AccountStatus("deactivated");
  static Approved = new AccountStatus("approved");

  constructor(status) {
    this.status = status;
  }

  /**
 static enum verification method
 * @param {String} str
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
