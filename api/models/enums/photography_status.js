/**
 * Enumerated Class for Photography Statuses
 */
export default class PhotographyStatus {
  static No_Photo = new AccountStatus("no_photo");
  static Needs_Photographer = new AccountStatus("needs_photographer");
  static Photographer_Assigned = new AccountStatus("photographer_assigned");
  static Photo_Complete = new AccountStatus("photo_complete");

  // Get all PhotographyStatuses
  static list = [this.No_Photo, this.Needs_Photographer, this.Photographer_Assigned, this.Photo_Complete];
  static listStr = this.list.map((status) => {
    return status.status;
  });

  constructor(status) {
    this.status = status;
  }

  /**
 static enum verification method
 * @param {String} str
 */
  static toPhotographyStatus(str) {
    switch (str.toLowerCase()) {
      case "no_photo":
        return this.No_Photo;
      case "needs_photographer":
        return this.Needs_Photographer;
      case "photographer_assigned":
        return this.Phtoographer_Assigned;
      case "photo_complete":
        return this.Photo_Complete;
      default:
    }
  }
}
