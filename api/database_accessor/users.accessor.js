import Connection from "../db/connection.js";
/*
import UnregisteredUser from "../models/user.unregistered.js";
import RegisteredUser from "../models/user.registered.js";
*/
import User from "../models/user.js";
import ArticlesAccessor from "../database_accessor/articles.accessor.js";
import { removeAllListeners } from "nodemon";

/**
 * UserAccessor Class
 *
 * All methods pertaining to accessing and sending
 * user data to the MongoDB Cluster are in this class.
 */
export default class UsersAccessor {

  /*
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
      throw e;
    }
  }

  /*
  * getUserByObjectId Method
  *
  * This method retrieves the user MongoDB object from the 
  * database based on a given objectId
  * 
  * @param {_id} objectId
  * @returns the User associated with the given objectId in 
  *          the database.
  * 
  */
  static async getUserByObjectId(objectId) {
    try {
      await Connection.open();
      const user = await User.findOne({ _id: objectId });
      return user;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  /*
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
      throw e;
    }
  }

  /*
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
      throw e;
    }
  }

  /*
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
      throw e;
    }
  }

  /*
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
      throw e;
    }
  }

  /*
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
      throw e;
    }
  }

  /*
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
      throw e;
    }
  }

  /*
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
      throw e;
    }
  }

  // METHODS THAT WERE PREVIOUSLY HERE

  /**
   * getUserByUsername Method
   *
   * This method retrieves the user MongoDB object from the
   * database. Throws an error if there is a pathology.
   *
   * Static - no instance required.
   * Async - promises to return the user after finding it.
   *
   * @param {String} username
   * @returns the User associated with the given Username in
   *          the database.
   */
  static async getRegisteredByUsername(username) {
    try {
      await Connection.open();
      const user = await RegisteredUser.findOne({ username: username });
      return user;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  /**
   * getUnregisteredByUsername Method
   *
   * This method pulls from the unregistered user database to find
   * a specific user given a username
   *
   * @param {*} username of user to find
   * @returns the found user
   */
  static async getUnregisteredByUsername(username) {
    try {
      await Connection.open();
      const user = await UnregisteredUser.findOne({ username: username });
      return user;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }



  /**
   * createUser Method
   *
   * This method creates a new user in the database
   * given a correctly defined user. Throws an error
   * if there is a pathology.
   *
   * Static - no instance required.
   * Async - promises to return the user after creating it.
   *
   * @param {User} userDoc User from Schema
   * @returns MongoDB user object
   */
  static async createUser(userDoc) {
    try {
      await Connection.open();
      const user = await UnregisteredUser.create(userDoc);
      return user;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  /**
   * getAllUnregistered Method
   *
   * Gets a list of all the users in the unregistered collection.
   *
   * @returns a list of all the unregistered users.
   */
  static async getAllUnregistered() {
    try {
      await Connection.open();
      const users = [];
      for await (const doc of UnregisteredUser.find()) {
        users.push(doc);
      }
      return users;
    } catch (e) {
      //server error 500
      throw e;
    }
  }

  /**
   * registerUser Method
   *
   * This method should only be accessible to admins.
   * This method takes the names of an unregistered users
   * and moves them to the registered user collection.
   *
   * @param {*} usernames list of usernames to make registered
   */
  static async registerUsers(usernames) {
    try {
      await Connection.open();
      const users = [];
      for await (const name of usernames) {
        const unregisteredUser = await UnregisteredUser.findOne({ username: name });
        const registeredUser = await RegisteredUser.create(unregisteredUser.toJSON());
        await UnregisteredUser.deleteOne({ username: name });
        users.push(registeredUser);
      }
      return users;
    } catch (e) {
      //server error 500, throw up the stack
      throw e;
    }
  }

  /**
   * deactivateUserByUsername Method
   *
   * This method should be accessible to all registered users.
   * This method takes the name of a user
   * and deactivates their account.
   *
   * @param {*} username username to make deactivated
   */
  static async deactivateUserByUsername(username) {
    try {
      await Connection.open("users");
      console.log("made it here");
      const user = await RegisteredUser.findOneAndUpdate(
        { username: username },
        {
          $set: {
            deactivated: true,
          },
        }
      );
      return user;
    } catch (e) {
      //server error 500, throw up the stack
      throw e;
    }
  }

  /**
   * deleteUserByUsername Method
   *
   * This method should be accessible to all registered users.
   * This method takes the name of a user
   * and deletes their account and all their contributions to the website.
   *
   * @param {*} username username to make deactivated
   */
  static async deleteUserByUsername(username) {
    try {
      await Connection.open("users");
      const user = await RegisteredUser.findOne({ username: username });

      // delete profile record
      await RegisteredUser.deleteOne({ username: username });

      // delete all articles they wrote
      await ArticlesAccessor.deleteArticleByUsername(username);

      return user;
    } catch (e) {
      //server error 500, throw up the stack
      throw e;
    }
  }

  /**
   * deactivateUserByUsername Method
   *
   * This method should be accessible to all registered users.
   * This method takes the name of a user
   * and deactivates their account.
   *
   * @param {*} username username to make deactivated
   */
  static async deactivateUserByUsername(username) {
    try {
      await Connection.open("users");
      console.log("made it here");
      const user = await RegisteredUser.findOneAndUpdate(
        { username: username },
        {
          $set: {
            deactivated: true,
          },
        }
      );
      return user;
    } catch (e) {
      //server error 500, throw up the stack
      throw e;
    }
  }

  /**
   * deleteUserByUsername Method
   *
   * This method should be accessible to all registered users.
   * This method takes the name of a user
   * and deletes their account and all their contributions to the website.
   *
   * @param {*} username username to make deactivated
   */
  static async deleteUserByUsername(username) {
    try {
      await Connection.open("users");
      const user = await RegisteredUser.findOne({ username: username });

      // delete profile record
      await RegisteredUser.deleteOne({ username: username });

      // delete all articles they wrote
      await ArticlesAccessor.deleteArticleByUsername(username);

      return user;
    } catch (e) {
      //server error 500, throw up the stack
      throw e;
    }
  }

  /**
   * updateUser Method
   *
   * This method updates an existing user in the database.
   *
   * @param {User} updatedUser Updated user object
   * @returns {User|null} Updated user or null if the user is not found
   */
  static async updateUser(updatedUser) {
    try {
      await Connection.open("users");

      const filter = { username: updatedUser.username };

      // Find the existing user
      const existingUser = await RegisteredUser.findOne(filter);

      if (!existingUser) {
        // If the user is not found, return null
        return null;
      }

      // Update the user fields with the new data
      existingUser.role = updatedUser.role;
      existingUser.information = updatedUser.information;
      // existingUser.password = updatedUser.password; // Password may be updated as part of future ticket

      // Save the updated user
      await existingUser.save();

      return existingUser;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
}
