import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import Permissions from "./permissions.js";
import Accounts from "./accounts.js";

export default class Authorize {
  /**
   * auth Method
   *
   * If the user is logged in, this method will call the next
   * http method in line. If not, this method will redirect the
   * user to be logged in.
   *
   * @param {HTTP REQ} req http request
   * @param {HTTP RES} res http response
   * @param {function} next http method
   * @param {String} route to be checked for
   */
  static auth(req, res, next, route) {
    dotenv.config();
    if (req.cookies.token) {
      const payload = jwt.verify(req.cookies.token, process.env.TOKEN_KEY);
      if (payload) {
        const role = Accounts.toAccount(payload.role);
        if (Permissions.check(route, role)) {
          next();
        } else {
          req.error = 4012;
          next();
        }
      } else {
        req.error = 4013;
        next();
      }
    } else {
      req.error = 4011;
      next();
    }
  }

  /**
   * getUsername of the currently logged in user
   *
   * @param {HTTP REQ} req
   * @returns {String} String username
   */
  static getUsername(req) {
    dotenv.config();
    if (req.cookies.token) {
      const payload = jwt.verify(req.cookies.token, process.env.TOKEN_KEY);
      if (payload) {
        return payload.username;
      } else {
        //
      }
    } else {
      //
    }
  }
}
