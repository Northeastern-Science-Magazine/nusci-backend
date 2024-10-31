/**
 * Enumerated Class for Account Statuses
 */
export default class AccountStatus {
  static Pending = new AccountStatus("pending");
  static Deactivated = new AccountStatus("deactivated");
  static Approved = new AccountStatus("approved");

  // Get all Account Statuses
  static list = [this.Pending, this.Deactivated, this.Approved];
  static listStr = this.list.map((status) => {
    return status.status;
  });

  /**
   * INTERNAL USE ONLY
   * Construct an AccountStatus enum
   *
   * @param {String} status
   */
  constructor(status) {
    this.status = status;
  }

  /**
   * String into its associated AccountStatus object
   *
   * @param {String} str
   * @returns {AccountStatus}
   */
  static toAccountStatus(str) {
    switch (str.toLowerCase()) {
      case this.Pending.status:
        return this.Pending;
      case this.Deactivated.status:
        return this.Deactivated;
      case this.Approved.status:
        return this.Approved;
      default:
    }
  }
}
