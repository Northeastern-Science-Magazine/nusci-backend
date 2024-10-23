import { ErrorValidation } from "../../error/errors.js";

/**
 * Enumerated Class for Design Statuses
 */
export default class DesignStatus {
  static Needs_Designer = new DesignStatus("needs_designer");
  static Has_Designer = new DesignStatus("has_designer");
  static In_Progress = new DesignStatus("in_progress");
  static Completed = new DesignStatus("completed");

  /**
   * INTERNAL USE ONLY
   * Construct a DesignStatus enum
   *
   * @param {String} status
   */
  constructor(status) {
    this.status = status;
  }

  /**
   * DesignStatus to its associated string
   *
   * @returns {String}
   */
  toString() {
    return this.status;
  }

  /**
   * String to its associated DesginStatus object
   *
   * @param {String} str
   * @returns {DesignStatus}
   */
  static toDesignStatus(str) {
    const designStatus = this.list().find(obj => obj.toString() === str.toLowerCase());
    if (!designStatus) {
      throw new ErrorValidation("Invalid Design Status enum given.");
    }
    return designStatus;
  }

  /**
   * Returns all DesignStatus objects as a list.
   *
   * @returns {List[DesignStatus]}
   */
  static list() {
    return Object.values(this);
  }

  /**
   * Returns all DesignStatus as a list of strings
   */
  static listr() {
    return Object.values(this).map((val) => val.toString());
  }
}
