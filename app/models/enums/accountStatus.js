import { ErrorInternalEnumValidation } from "../../error/internalErrors.js";

/**
 * Enumerated Class for Account Statuses
 */
export default class AccountStatus {
  static Pending = new AccountStatus("pending");
  static Deactivated = new AccountStatus("deactivated");
  static Approved = new AccountStatus("approved");
  static Denied = new AccountStatus("denied");

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
   * AccountStatus into its associated string
   *
   * @returns {String}
   */
  toString() {
    return this.status;
  }

  /**
   * String into its associated AccountStatus object
   *
   * @param {String} str
   * @returns {AccountStatus}
   */
  static toAccountStatus(str) {
    switch (str.toLowerCase()) {
      case this.Pending.toString():
        return this.Pending;
      case this.Deactivated.toString():
        return this.Deactivated;
      case this.Approved.toString():
        return this.Approved;
      case this.Denied.toString():
        return this.Denied;
      default:
        throw new ErrorInternalEnumValidation("Invalid AccountStatus given.");
    }
  }

  /**
   * Returns all AccountStatus objects as a list.
   *
   * @returns {List[AccountStatus]}
   */
  static list() {
    return Object.values(this);
  }

  /**
   * Returns all AccountStatus as a list of strings
   */
  static listr() {
    return Object.values(this).map((val) => val.toString());
  }
}
