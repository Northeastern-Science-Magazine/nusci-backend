import UsersAccessor from "../database_accessor/users.accessor.js";
import Errors from "../error/errors.js";
import handleError from "../error/error.handler.js";

/**
 * This file controls all the routes/requests that only admins
 * should have access to.
 *
 */

export default class AdminController {
  static async getUserApprovals(req, res, next) {
    try {
      const users = await UsersAccessor.getAllUnregistered();
      res.render("approve_registration", { allUsers: users });
    } catch (e) {
      return handleError(res, Errors[500].DataGET);
    }
  }

  static async postUserApprovals(req, res, next) {
    try {
      let usernames = [];
      const reqUserObj = req.body;
      for (var name in reqUserObj) {
        usernames.push(name);
      }
      const users = await UsersAccessor.registerUsers(usernames);
      res.json(users);
    } catch (e) {
      return handleError(res, Errors[500].DataPOST);
    }
  }
}
