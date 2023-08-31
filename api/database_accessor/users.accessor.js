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
            await Connection.open('users');
            const user = await RegisteredUser.findOne({ username: username });
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
            await Connection.open('users');
            const user = await UnregisteredUser.create(userDoc);
            return user;
        } catch (e) {
            console.log(e);
            throw e;
        }
    }

    static async getAllUnregistered() {
        try {
            await Connection.open('users')
            const users = [];
            for await (const doc of UnregisteredUser.find()) {
                users.push(doc);
            }
            return users;
        } catch (e) {
            //server error 500
        }
    }

    /**
     * registerUser Method
     * 
     * This method should only be accessible to admins.
     * This method takes the names of an unregistered users
     * and moves them to the registered user database.
     * 
     */
    static async registerUsers(usernames) {
        try {
            await Connection.open('users');
            const users = [];
            for await (const name of usernames) {
                const unregisteredUser = await UnregisteredUser.findOne({ username: name });
                const registeredUser = await RegisteredUser.create(unregisteredUser.toJSON());
                await UnregisteredUser.deleteOne({ username: name });
                users.push(registeredUser);
            }
            return users;
        } catch (e) {
            //server error 500
        }
        
    }
}
