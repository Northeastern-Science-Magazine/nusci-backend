import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import Accounts from "../models/enums/accounts.js";
import { ErrorFailedLogin, ErrorForbidden, ErrorNotLoggedIn } from "../error/errors.js";

/**
 * Authorize class
 *
 * Contains methods that are used to authorize users
 * by authenticating tokens, and verify valid permissions
 * to routes requested by said users.
 */
export default class Authorize {
  /**
   * allow method
   *
   * Generates a callback function that verifies the
   * currently signed in user has one of the given permissions.
   *
   * @param {List} roles
   * @returns {Function} callback function
   */
  static allow(roles) {
    return (req, res, next) => {
      let payload;
      try {
        payload = Authorize.verifyToken(req);
      } catch (e) {
        // Clear an invalid cookie so the browser stops sending it and the user can log in again.
        res.clearCookie("token");
        return e.throwHttp(req, res);
      }

      const userRoles = payload.roles.map((role) => Accounts.toAccount(role));
      if (roles.some((element) => userRoles.includes(element))) {
        next();
      } else {
        new ErrorForbidden().throwHttp(req, res);
      }
    };
  }

  /**
   * verifyToken method
   *
   * Returns the payload of the currently signed in user's token.
   *
   * @param {HTTP REQ} req
   * @returns {Object} token payload { email, roles }
   */
  static verifyToken(req) {
    dotenv.config();
    if (!req.cookies.token) {
      throw new ErrorNotLoggedIn();
    }
    try {
      return jwt.verify(req.cookies.token, process.env.SERVER_TOKEN_KEY);
    } catch (e) {
      // jwt.verify throws on an invalid or tampered token; it never returns a falsy payload.
      throw new ErrorNotLoggedIn();
    }
  }

  /**
   * isLoggedIn method
   *
   * Returns whether the request carries a valid login token.
   *
   * @param {HTTP REQ} req
   * @returns {Boolean} true only for a valid token
   */
  static isLoggedIn(req) {
    try {
      Authorize.verifyToken(req);
      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * getEmail of the currently logged in user
   * using the token as auth
   *
   * @param {HTTP REQ} req
   * @returns {String} Email
   */
  static getEmail(req) {
    return Authorize.verifyToken(req).email;
  }

  /**
   * getRole of the currently logged in user
   * using the token as auth
   *
   * @param {HTTP REQ} req
   * @param {HTTP RES} res
   * @returns {String} String role
   */
  static getRoles(req, res) {
    dotenv.config();
    if (req.cookies.token) {
      const payload = jwt.verify(req.cookies.token, process.env.SERVER_TOKEN_KEY);
      if (payload) {
        return payload.roles;
      } else {
        throw new ErrorFailedLogin();
      }
    } else {
      throw new ErrorNotLoggedIn();
    }
  }
}
