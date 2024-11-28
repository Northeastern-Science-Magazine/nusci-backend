import { ErrorValidation } from "../../error/errors.js";

/**
 * Enumerated Class for Photography Statuses
 */
export default class PhotographyStatus {
  static No_Photo = new PhotographyStatus("no_photo");
  static Needs_Photographer = new PhotographyStatus("needs_photographer");
  static Photographer_Assigned = new PhotographyStatus("photographer_assigned");
  static Photo_Complete = new PhotographyStatus("photo_complete");

  /**
   * INTERNAL USE ONLY
   * Construct a PhotographyStatus enum
   *
   * @param {String} status
   */
  constructor(status) {
    this.status = status;
  }

  /**
   * PhotographyStatus to its associated string
   *
   * @returns {String}
   */
  toString() {
    return this.status;
  }

  /**
   * String to its associated PhotographyStatus object
   *
   * @param {String} str
   * @returns {PhotographyStatus}
   */
  static toPhotographyStatus(str) {
    const photographyStatus = this.list().find(obj => obj.toString() === str.toLowerCase());
    if (!photographyStatus) {
      throw new ErrorValidation("Invalid Photography Status enum given.");
    }
    return photographyStatus;
  }

  /**
   * Returns all PhotographyStatus objects as a list.
   *
   * @returns {List[PhotographyStatus]}
   */
  static list() {
    return Object.values(this);
  }

  /**
   * Returns all PhotographyStatus as a list of strings
   */
  static listr() {
    return Object.values(this).map((val) => val.toString());
  }
}
