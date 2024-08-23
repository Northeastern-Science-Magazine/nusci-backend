import { ErrorInternalEnumValidation } from "../../error/internalErrors.js";

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
    switch (str.toLowerCase()) {
      case this.No_Photo.status:
        return this.No_Photo;
      case this.Needs_Photographer.status:
        return this.Needs_Photographer;
      case this.Photographer_Assigned.status:
        return this.Photographer_Assigned;
      case this.Photo_Complete.status:
        return this.Photo_Complete;
      default:
        throw new ErrorInternalEnumValidation("Invalid PhotographyStatus given.");
    }
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
