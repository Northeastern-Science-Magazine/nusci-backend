import Connection from "../db/connection.js";
import User from "../models/dbModels/user.js";
import AccountStatus from "../models/enums/account_status.js";
import { ErrorDatabaseConnection } from "../error/httpErrors.js";
import { ErrorInternalUnexpected } from "../error/internalErrors.js";

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

      // Check if it's a DB connection error
      if (e instanceof ErrorDatabaseConnection) {
        // Throw up the stack
        throw e;
      } else {
        // Else throw unexpected error
        throw new ErrorInternalUnexpected("Unexpected error occurred");
      }
    }
  }

  /**
   * getApprovedByUsername Method
   *
   * This method retrieves the user MongoDB object from the
   * database based on a given username
   *
   * @param {String} username
   * @returns the User associated with the given username in
   * the database.
   */
  static async getApprovedByUsername(username) {
    try {
      await Connection.open();

      const user = await User.findOne({
        username: username,
        status: AccountStatus.Approved.toString(), // Use MongoDB filter for equal to approved status
      });

      return user;
    } catch (e) {
      console.log(e);

      // Check if it's a DB connection error
      if (e instanceof ErrorDatabaseConnection) {
        // Throw up the stack
        throw e;
      } else {
        // Else throw unexpected error
        throw new ErrorInternalUnexpected("Unexpected error occurred");
      }
    }
  }

  /**
   * getUnapprovedByUsername Method
   *
   * This method retrieves the user MongoDB object from the
   * database based on a given username
   *
   * @param {String} username
   * @returns the User associated with the given username in
   * the database.
   */
  static async getUnapprovedByUsername(username) {
    try {
      await Connection.open();

      const user = await User.findOne({
        username: username,
        status: { $ne: AccountStatus.Approved.toString() }, // Use MongoDB filter for not equal to approved status
      });

      if (user) return user;
      return null;
    } catch (e) {
      console.log(e);

      // Check if it's a DB connection error
      if (e instanceof ErrorDatabaseConnection) {
        // Throw up the stack
        throw e;
      } else {
        // Else throw unexpected error
        throw new ErrorInternalUnexpected("Unexpected error occurred");
      }
    }
  }

  /**
   * approveUserByUsername Method
   * 
   * This method retrieves the user MongoDB object from the
   * database based on a given username and update the user's status to approved.
   * 
   * @param {String} username 
   * @returns the updated user object with the status set to approved.
   */
  static async approveUserByUsername(username) {
    try {
      await Connection.open();

      //update the status 
      const user = await User.findOneAndUpdate(
        { username: username },
        { status: AccountStatus.Approved.toString() },
        { new: true }
      );

      return user;
    } catch (e) {
      // Check if it's a DB connection error
      if (e instanceof ErrorDatabaseConnection) {
        // Throw up the stack
        throw e;
      } else {
        // Else throw unexpected error
        throw new ErrorInternalUnexpected("Unexpected error occurred");
      }
    }
  }

  /**
   * denyUserByUsername Method
   * 
   * This method retrieves the user MongoDB object from the
   * database based on a given username and update the user's status to denied.
   * 
   * @param {String} username 
   * @returns the updated user object with the status set to denied.
   */
  static async denyUserByUsername(username) {
    try {
      await Connection.open();

      //update the status
      const user = await User.findOneAndUpdate(
        { username: username },
        { status: AccountStatus.Denied.toString() },
        { new: true }
      );
      return user;
    } catch (e) {
      // Check if it's a DB connection error
      if (e instanceof ErrorDatabaseConnection) {
        // Throw up the stack
        throw e;
      } else {
        // Else throw unexpected error
        throw new ErrorInternalUnexpected("Unexpected error occurred");
      }
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
      // Check if it's a DB connection error
      if (e instanceof ErrorDatabaseConnection) {
        // Throw up the stack
        throw e;
      } else {
        // Else throw unexpected error
        throw new ErrorInternalUnexpected("Unexpected error occurred");
      }
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

  /**
   * createUser Method
   *
   * This method creates a new user in the database.
   *
   * @param {Object} user
   * @returns the newly created user
   */
  static async createUser(user) {
    try {
      await Connection.open();
      const newUser = new User(user);
      await newUser.save();
      return newUser;
    } catch (e) {

      // Check if it's a DB connection error
      if (e instanceof ErrorDatabaseConnection) {
        // Throw up the stack
        throw e;
      } else {
        // Else throw unexpected error
        throw new ErrorInternalUnexpected("Unexpected error occurred");
      }
    }
  }
}

/**
 * @TODO get users by time range (both modification and creation time)
 */
