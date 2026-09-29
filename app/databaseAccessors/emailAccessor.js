import Connection from "../db/connection.js";
import Email from "../models/dbModels/email.js";

export default class EmailAccessor {
  /**
   * Creates an email record in the database.
   *
   * @param {Object} emailDoc to, from, type, subject, variables
   */
  static async createEmail(emailDoc) {
    await Connection.open();
    const email = new Email(emailDoc);
    await email.save();
  }
}
