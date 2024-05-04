/**
 * Enumerated Class for Account Statuses
 *
 * None - should never be part of a permission set
 * It is simply denoting that such a role does not exist.
 */
export default class AccountStatus {
  static Pending = new AccountStatus("pending");
  static Deactivated = new AccountStatus("deactivated");
  static Approved = new AccountStatus("approved");

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
};

