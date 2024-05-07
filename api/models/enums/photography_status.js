/**
 * Enumerated Class for Photography Statuses
 */
export default class PhotographyStatus {
  static No_Photo = new AccountStatus("no_photo");
  static Needs_Photographer = new AccountStatus("needs_photographer");
  static Phtoographer_Assigned = new AccountStatus("phtoographer_assigned");
  static Photo_Complete = new AccountStatus("photo_complete");

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
      case "phtoographer_assigned":
        return this.Phtoographer_Assigned;
      case "photo_complete":
        return this.Photo_Complete;
      default:
    }
  }
}
