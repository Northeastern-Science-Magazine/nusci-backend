import { ErrorValidation } from "../../error/errors.js";

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
    const accountStatus = this.list().find(obj => obj.toString() === str.toLowerCase());
    if (!accountStatus) {
      throw new ErrorValidation("Invalid Article Status enum given.");
    }
    return accountStatus;
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
