import User from "../models/User.js";
import Database from "../db/connection.js";

/**
 * UserAccessor Class
 * 
 * All methods pertaining to accessing and sending
 * user data to the MongoDB Cluster are in this class.
 */
export default class UsersAccessor {

    /**
     * injectDB Method
     * 
     * Connects to the given database within the
     * MongoDB Cluster. "Injects" the correct DB
     * into the requestbefore making the connection.
     * 
     * Static - no instance required.
     * Async - promises to make the connection.
     * 
     * @param {String} dbName database name to connect to.
     * @returns the established DB connection
     */
    static async injectDB(dbName) {
        try {
            return await Database.connect(dbName);
        } catch(e) {
            console.log(e);
            throw e;
        }        
    }

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
    static async getUserByUsername(username) {
        try {
            const connection = await this.injectDB('users');
            const user = await User.findOne({ username: username });
            Database.close(connection);
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
            const connection = await this.injectDB('users');
            const user = await User.create(userDoc);
            Database.close(connection);
            return user;
        } catch (e) {
            console.log(e);
            throw e;
        }
    }
}
