import UsersAccessor from "../database_accessor/users.accessor.js";
import { ErrorValidation } from "../error/http_errors.js";

/**
 * AdminController class
 *
 * Contains methods that handle requests only admins should
 * have access to.
 *
 */
export default class AdminController {
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
      throw ErrorValidation;
    }
  }
}
