export default class PhotographyStatus {
  static No_Photo = new AccountStatus("no_photo");
  static Needs_Photographer = new AccountStatus("needs_photographer");
  static Phtoographer_Assigned = new AccountStatus("phtoographer_assigned");
  static Photo_Complete = new AccountStatus("photo_complete");

  /**
 static enum verification method
 * @param {String} str
 */
  static toAccountStatus(str) {
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
};
