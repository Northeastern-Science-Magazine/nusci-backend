import { ErrorValidation } from "../../error/errors.js";

/**
 * Enumerated Class for Account Types
 *
 * None - should never be part of a permission set
 * It is simply denoting that such a role does not exist.
 */
export default class Accounts {
  static None = new Accounts("none");
  static Author = new Accounts("author");
  static Editor = new Accounts("editor");
  static Photographer = new Accounts("photographer");
  static Developer = new Accounts("developer");
  static Designer = new Accounts("designer");
  static Admin = new Accounts("admin");

  /**
   * INTERNAL USE ONLY
   * Construct an Account enum
   *
   * @param {String} role
   */
  constructor(role) {
    this.role = role;
  }

  /**
   * Account to its associated string
   *
   * @returns {String}
   */
  toString() {
    return this.role;
  }

  /**
   * String into its associated Account object
   *
   * @param {String} str
   * @returns {Accounts}
   */
  static toAccount(str) {
    const account = this.list().find(obj => obj.toString() === str.toLowerCase());
    if (!account) {
      throw new ErrorValidation("Invalid Accounts enum given.");
    }
    return account;
  }

  /**
   * Returns all Accounts objects as a list.
   *
   * @returns {List[Accounts]}
   */
  static list() {
    return Object.values(this);
  }

  /**
   * Returns all Accounts as a list of strings
   */
  static listr() {
    return Object.values(this).map((val) => val.toString());
  }
}
