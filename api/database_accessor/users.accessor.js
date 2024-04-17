import Connection from "../db/connection.js";
import UnregisteredUser from "../models/user.unregistered.js";
import RegisteredUser from "../models/user.registered.js";
import ArticlesAccessor from "../database_accessor/articles.accessor.js";

/**
 * UserAccessor Class
 *
 * All methods pertaining to accessing and sending
 * user data to the MongoDB Cluster are in this class.
 */
export default class UsersAccessor {
  /**
   * getRegisteredByUsername Method
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
      console.log("made it here")
      const user = await RegisteredUser.findOneAndUpdate({ username: username}, 
        {$set: {
          deactivated: true
        }
      });
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
      await RegisteredUser.deleteOne( { username: username });

      // delete all articles they wrote
      await ArticlesAccessor.deleteArticleByUsername(username);
        
      return user;
      } catch (e) {
      //server error 500, throw up the stack
      throw e;
    }
  }
}
