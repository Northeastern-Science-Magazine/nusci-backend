import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import ProtectedRoutes from "./protected.routes.js";
import Accounts from "../models/enums/accounts.js";

/**
 * Authorize class
 *
 * Contains methods that are used to authorize users
 * by authenticating tokens, and verify valid permissions
 * to routes requested by said users.
 */
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
        if (ProtectedRoutes.check(route, role)) {
          next();
        } else {

          return handleError(res, Errors[403].Forbidden);
        }
      } else {
        return handleError(res, Errors[403].Forbidden);
      }
    } else {
      return handleError(res, Errors[401].Unauthorized);
    }
  }

  /**
   * getUsername of the currently logged in user
   * using the token as auth
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
        return handleError(res, Error[403].Forbidden);
      }
    } else {
      return handleError(res, Error[401].Unauthorized);
    }
  }

  /**
   * getRole of the currently logged in user
   * using the token as auth
   *
   * @param {HTTP REQ} req
   * @returns {String} String role
   */
  static getRole(req) {
    dotenv.config();
    if (req.cookies.token) {
      const payload = jwt.verify(req.cookies.token, process.env.TOKEN_KEY);
      if (payload) {
        return payload.role;
      } else {
        return handleError(res, Error[403].Forbidden);
      }
    } else {
      return handleError(res, Error[401].Unauthorized);
    }
  }
}
// auth, get http