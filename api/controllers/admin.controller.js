import UsersAccessor from '../database_accessor/users.accessor.js';

/**
 * This file controls all the routes/requests that only admins
 * should have access to.
 * 
 */

export default class AdminController {
    static async getUserApprovals(req, res, next) {
        if(!req.error) {
            const users = await UsersAccessor.getAllUnregistered();
            res.render("approve_registration", {allUsers: users});
        } else {
            return next();
        }
    }

    static async postUserApprovals(req, res, next) {
        if(!req.error) {
            let usernames = [];
            const reqUserObj = req.body;
            for(var name in reqUserObj) {
                usernames.push(name);
            }
            const users = await UsersAccessor.registerUsers(usernames);
            res.json(users);
        } else {
            return next();
        }
    }
}
 