import UnregisteredUser from "../models/user.unregistered.js";
import Connection from "../db/connection.js";

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
            return await Connection.open(dbName);
        } catch(e) {
            console.log(e);
            throw e;
        }        
    }

    /**
     * NOTE: upon completion, search should only go
     * through registered users. There should be separate
     * methods to find unregistered and registered users.
     * 
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
            const user = await UnregisteredUser.findOne({ username: username });
            Connection.close(connection);
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
            const user = await UnregisteredUser.create(userDoc);
            Connection.close(connection);
            return user;
        } catch (e) {
            console.log(e);
            throw e;
        }
    }

    /**
     * registerUser Method
     * 
     * This method should only be accessible to admins.
     * This method takes the name of an unregistered user
     * and moves them to the registered user database.
     * 
     */
}
