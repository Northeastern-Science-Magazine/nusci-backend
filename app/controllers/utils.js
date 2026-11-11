import UsersAccessor from "../databaseAccessors/userAccessor.js";
import { ErrorUserNotFound, ErrorValidation } from "../error/errors.js";

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

  /**
   * Get a list of User IDs by a list of emails, requiring every
   * user to exist and to hold the given role.
   *
   * @param {[String]} emails Array of emails
   * @param {Accounts} role Role every user must have
   * @param {String} field Name of the field being resolved, used in error messages
   * @throws {ErrorValidation} When an email has no user, or the user lacks the role
   * @returns Array of user IDs, in the same order as the given emails
   */
  static async getUserIdsByEmailsWithRole(emails, role, field) {
    const normalized = emails.map((email) => email.toLowerCase());
    const users = await UsersAccessor.getUsersByEmails(normalized);
    const usersByEmail = new Map(users.map((user) => [user.email.toLowerCase(), user]));

    const missing = normalized.filter((email) => !usersByEmail.has(email));
    if (missing.length > 0) {
      throw new ErrorValidation(`No user found for ${field}: ${missing.join(", ")}`);
    }

    const wrongRole = normalized.filter((email) => !usersByEmail.get(email).roles.includes(role.toString()));
    if (wrongRole.length > 0) {
      throw new ErrorValidation(`Users listed as ${field} must have the ${role} role: ${wrongRole.join(", ")}`);
    }

    return normalized.map((email) => usersByEmail.get(email)._id);
  }
}
