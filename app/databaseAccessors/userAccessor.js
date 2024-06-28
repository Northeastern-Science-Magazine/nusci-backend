import Connection from "../db/connection.js";
import User from "../models/dbModels/user.js";

/**
 * UserAccessor Class
 *
 * All methods pertaining to accessing and sending
 * user data to the MongoDB Cluster are in this class.
 */
export default class UsersAccessor {
  /**
   * getUserById Method
   *
   * This method retrieves the user MongoDB object from the
   * database based on a given objectId
   *
   * @param {ObjectId} objectId
   * @returns the User associated with the given objectId in
   *          the database.
   *
   */
  static async getUserById(objectId) {
    try {
      await Connection.open();
      const user = await User.findOne({ _id: objectId });
      return user;
    } catch (e) {
      console.log(e);
      ErrorInternalAPIModelFieldValidation(e);
    }
  }

  /**
   * getUserByUsername Method
   *
   * This method retrieves the user MongoDB object from the
   * database based on a given username
   *
   * @param {String} username
   * @returns the User associated with the given username in
   * the database.
   */
  static async getUserByUsername(username) {
    try {
      await Connection.open();
      const user = await User.findOne({ username: username });
      return user;
    } catch (e) {
      console.log(e);
      ErrorInternalAPIModelFieldValidation(e);
    }
  }

  /**
   * getUserByEmail Method
   *
   * This method retrieves the user MongoDB object from the
   * database based on a given email
   *
   * @param {String} email
   * @returns the User associated with the given email in
   *          the database.
   *
   */
  static async getUserByEmail(email) {
    try {
      await Connection.open();
      const user = await User.findOne({ emails: { $in: [email] } });
      return user;
    } catch (e) {
      console.log(e);
      ErrorInternalAPIModelFieldValidation(e);
    }
  }

  /**
   * getUserByRole Method
   *
   * This method retrieves the users MongoDB object from the
   * database based on a given role
   *
   * @param {String} role
   * @returns the users associated with the given role in
   *          the database.
   *
   */
  static async getUserByRole(role) {
    try {
      await Connection.open();
      const users = await User.find({ roles: { $in: [role] } });
      return users;
    } catch (e) {
      console.log(e);
      ErrorInternalAPIModelFieldValidation(e);
    }
  }

  /**
   * getUserByStatus Method
   *
   * This method retrieves the users MongoDB object from the
   * database based on a given status
   *
   * @param {String} status
   * @returns the users associated with the given status in
   *          the database.
   *
   */
  static async getUserByStatus(status) {
    try {
      await Connection.open();
      const users = await User.find({ status: status });
      return users;
    } catch (e) {
      console.log(e);
      ErrorInternalAPIModelFieldValidation(e);
    }
  }

  /**
   * getUserByApprovingUser Method
   *
   * This method retrieves the users MongoDB object from the
   * database based on the approving User
   *
   * @param {ObjectId} approvingUser
   * @returns the users associated with the given approvingUser in
   *          the database.
   *
   */
  static async getUserByApprovingUser(approvingUser) {
    try {
      await Connection.open();
      const users = await User.find({ approvingUser: approvingUser });
      return users;
    } catch (e) {
      console.log(e);
      ErrorInternalAPIModelFieldValidation(e);
    }
  }

  /**
   * getUsersByGraduationYear Method
   *
   * This method retrieves the users MongoDB object from the
   * database based on the graduation year
   *
   * @param {Number} gradYear
   * @returns the users associated with the given graduation Year in
   *          the database.
   *
   */
  static async getUsersByGraduationYear(gradYear) {
    try {
      await Connection.open();
      const users = await User.find({ graduationYear: gradYear });
      return users;
    } catch (e) {
      console.log(e);
      ErrorInternalAPIModelFieldValidation(e);
    }
  }

  /**
   * getUsersByMajor Method
   *
   * This method retrieves the users MongoDB object from the
   * database based on the given major
   *
   * @param {String} major
   * @returns the users associated with the given major in
   *          the database.
   *
   */
  static async getUsersByMajor(major) {
    try {
      await Connection.open();
      const users = await User.find({ majors: { $in: [major] } });
      return users;
    } catch (e) {
      console.log(e);
      ErrorInternalAPIModelFieldValidation(e);
    }
  }

  /**
   * getUserByPhone Method
   *
   * This method retrives the users MongoDB object from the
   * database based on the phone
   *
   * @param {String} phone
   * @returns the user associated with the given phone in
   *          the database.
   *
   */
  static async getUserByPhone(phone) {
    try {
      await Connection.open();
      const user = await User.findOne({ phone: phone });
      return user;
    } catch (e) {
      console.log(e);
      ErrorInternalAPIModelFieldValidation(e);
    }
  }
}

/**
 * @TODO get users by time range (both modification and creation time)
 */
