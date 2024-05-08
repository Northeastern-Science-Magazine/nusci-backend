/**
 * Enumerated Class for Photography Statuses
 */
export default class PhotographyStatus {
  static No_Photo = new PhotographyStatus("no_photo");
  static Needs_Photographer = new PhotographyStatus("needs_photographer");
  static Photographer_Assigned = new PhotographyStatus("photographer_assigned");
  static Photo_Complete = new PhotographyStatus("photo_complete");

  // Get all PhotographyStatuses
  static list = [this.No_Photo, this.Needs_Photographer, this.Photographer_Assigned, this.Photo_Complete];
  static listStr = this.list.map((status) => {
    return status.status;
  });

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
    }
  }
}
