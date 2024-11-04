import Connection from "../db/connection.js";
import User from "../models/dbModels/user.js";
import AccountStatus from "../models/enums/accountStatus.js";

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
    await Connection.open();
    const user = await User.findOne({ _id: objectId });
    return user;
  }

  /**
   * Get User IDs by a email
   *
   * @param {String} email - Email
   * @returns {ObjectId} - user's ID
   */
  static async getUserIdByEmail(email) {
    await Connection.open();
    const userId = await User.findOne({ email: email }, "_id");
    return userId;
  }

  /**
   * getApprovedByEmail Method
   *
   * This method retrieves the user MongoDB object from the
   * database based on a given email
   *
   * @param {String} email
   * @returns the User associated with the given email in
   * the database.
   */
  static async getApprovedByEmail(email) {
    await Connection.open();
    const user = await User.findOne({
      email: email,
      status: AccountStatus.Approved.toString(), // Use MongoDB filter for equal to approved status
    });
    return user;
  }

  /**
   * getUnapprovedByEmail Method
   *
   * This method retrieves the user MongoDB object from the
   * database based on a given email
   *
   * @param {String} email
   * @returns the User associated with the given email in
   * the database.
   */
  static async getUnapprovedByemail(email) {
    await Connection.open();
    const user = await User.findOne({
      email: email,
      status: { $ne: AccountStatus.Approved.toString() }, // Use MongoDB filter for not equal to approved status
    });
    return user;
  }

  /**
   * approveUserByEmail Method
   *
   * This method retrieves the user MongoDB object from the
   * database based on a given email and update the user's status to approved.
   *
   * @param {String} email
   * @returns the updated user object with the status set to approved.
   */
  static async approveUserByEmail(email) {
    await Connection.open();
    //update the status
    const user = await User.findOneAndUpdate({ email: email }, { status: AccountStatus.Approved.toString() }, { new: true });
    return user;
  }

  /**
   * denyUserByEmail Method
   *
   * This method retrieves the user MongoDB object from the
   * database based on a given email and update the user's status to denied.
   *
   * @param {String} email
   * @returns the updated user object with the status set to denied.
   */
  static async denyUserByEmail(email) {
    await Connection.open();
    //update the status
    const user = await User.findOneAndUpdate({ email: email }, { status: AccountStatus.Denied.toString() }, { new: true });
    return user;
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
    await Connection.open();
    const user = await User.findOne({ email: email });
    return user;
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
    await Connection.open();
    const users = await User.find({ roles: { $in: [role] } });
    return users;
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
    await Connection.open();
    const users = await User.find({ status: status });
    return users;
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
    await Connection.open();
    const users = await User.find({ approvingUser: approvingUser });
    return users;
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
    await Connection.open();
    const users = await User.find({ graduationYear: gradYear });
    return users;
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
    await Connection.open();
    const users = await User.find({ majors: { $in: [major] } });
    return users;
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
    await Connection.open();
    const user = await User.findOne({ phone: phone });
    return user;
  }

  /**
   * createUser Method
   *
   * This method creates a new user in the database.
   *
   * @param {Object} user
   * @returns the newly created user
   */
  static async createUser(user) {
    await Connection.open();
    const newUser = new User(user);
    await newUser.save();
    return newUser;
  }
}

/**
 * @TODO get users by time range (both modification and creation time)
 */
