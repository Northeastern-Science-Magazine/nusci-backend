import Connection from "../db/connection.js";
import UnregisteredUser from "../models/user.unregistered.js";
import RegisteredUser from "../models/user.registered.js";

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
      await Connection.open("users");
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
      await Connection.open("users");
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
      await Connection.open("users");
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
      await Connection.open("users");
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
      await Connection.open("users");
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
    
    // Assuming you have a common field like "username" to identify the user
    const filter = { username: updatedUser.username }; // Update with the appropriate field for your use case
    console.log(updatedUser.username);
    // Find the existing user
    const existingUser = await RegisteredUser.findOne(filter);

    if (!existingUser) {
      // If the user is not found, return null or throw an error based on your preference
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
