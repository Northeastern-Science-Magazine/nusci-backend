import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import Accounts from "../models/enums/accounts.js";
import { ErrorFailedLogin, ErrorForbidden, ErrorNotLoggedIn } from "../error/errors.js";
import LoginToken from "./token.js";

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
      dotenv.config();
      if (req.cookies.token) {
        const payload = jwt.verify(req.cookies.token, process.env.SERVER_TOKEN_KEY);
        if (payload) {
          const userRoles = payload.roles.map((role) => Accounts.toAccount(role));
          if (roles.some((element) => userRoles.includes(element))) {
            next();
          } else {
            new ErrorForbidden().throwHttp(req, res);
          }
        } else {
          new ErrorForbidden().throwHttp(req, res);
        }
      } else {
        new ErrorNotLoggedIn().throwHttp(req, res);
      }
    };
  }

  /**
   * getEmail of the currently logged in user
   * using the token as auth
   *
   * @param {HTTP REQ} req
   * @returns {String} Email
   */
  static getEmail(req) {
    dotenv.config();
    if (req.cookies.token) {
      const payload = jwt.verify(req.cookies.token, process.env.SERVER_TOKEN_KEY);
      if (payload) {
        return payload.email;
      } else {
        new ErrorFailedLogin().throwHttp(req, res);
      }
    } else {
      new ErrorNotLoggedIn().throwHttp(req, res);
    }
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
