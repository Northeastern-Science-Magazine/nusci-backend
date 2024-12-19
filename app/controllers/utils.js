import UsersAccessor from "../databaseAccessors/userAccessor.js";
import { ErrorUserNotFound } from "../error/errors.js";

/**
 * Utility class for controller methods.
 *
 * This class might include methods that are commonly used throughout
 * the controller files, but cannot be in any specific controller file
 * due to circular imports. Also, regular utlity functions are welcome
 */
export default class Utils {
  /**
   * Get a user's ObjectId by email
   *
   * This method throws because semantically, you should only want
   * to access the ID of a user that does exist -- and it expect it
   * to be a problem if not.
   *
   * @param {String} email - Email
   * @throws When no user by the given email is found
   * @returns user's ID
   */
  static async getUserIdByEmail(email) {
    const userId = await UsersAccessor.getUserIdByEmail(email);
    if (!userId) {
      throw new ErrorUserNotFound(`User not found for email: ${email}`);
    }
    return userId;
  }

  /**
   * Get a list of User IDs by a list emails
   *
   * @param {[String]} email Array of emails
   * @returns Array of user IDs
   */
  static async getUserIdsByEmails(emails) {
    try {
      const userIds = [];
      for (const email of emails) {
        const userId = await this.getUserIdByEmail(email);
        userIds.push(userId);
      }
      return userIds;
    } catch (e) {
      throw e;
    }
  }
}
