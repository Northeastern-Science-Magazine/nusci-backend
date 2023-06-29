import mongodb from "mongodb";

const OBJECT_ID = new mongodb.ObjectId();
let users;

export default class UserAccessor {
    static async injectDB(connection) {
        if (users) {
            return;
        }
        try {
            users = await connection
                .db("UserInfo")
                .collection("NuSciUsers");
        } catch (e) {
            console.error(e);
        }
    }

    static async getUser(userId) {
        try {
            return await users.findOne({ _id: OBJECT_ID(userId) });
        } catch (e) {
            console.error(e);
            return { error: e };
        }
    }

    
}
