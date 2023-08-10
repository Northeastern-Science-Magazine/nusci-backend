import User from "../models/User.js";

export default class UsersAccessor {
    static async getUserByUsername(username) {
        try {
            return await User.findOne({ username: username });
        } catch (e) {
            console.log(e);
            throw e;
        }
    }

    static async createUser(userDoc) {
        try {
            return await User.create(userDoc);
        } catch (e) {
            console.log(e);
            throw e;
        }
    }
}
