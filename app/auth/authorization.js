import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import Accounts from "../models/enums/accounts.js";
import {
  ErrorNoTokenProvided,
  ErrorIncorrectPassword,
  ErrorLoginInformation,
  ErrorUserPermissions,
} from "../error/httpErrors.js";

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
            ErrorUserPermissions.throwHttp(req, res);
          }
        } else {
          ErrorLoginInformation.throwHttp(req, res);
        }
      } else {
        ErrorNoTokenProvided.throwHttp(req, res);
      }
    };
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
      const payload = jwt.verify(req.cookies.token, process.env.SERVER_TOKEN_KEY);
      if (payload) {
        return payload.username;
      } else {
        ErrorIncorrectPassword.throwHttp(req, res);
      }
    } else {
      ErrorNoTokenProvided.throwHttp(req, res);
    }
  }

  /**
   * getRole of the currently logged in user
   * using the token as auth
   *
   * @param {HTTP REQ} req
   * @returns {String} String role
   */
  static getRoles(req) {
    dotenv.config();
    if (req.cookies.token) {
      const payload = jwt.verify(req.cookies.token, process.env.SERVER_TOKEN_KEY);
      if (payload) {
        return payload.roles;
      } else {
        ErrorIncorrectPassword.throwHttp(req, res);
      }
    } else {
      ErrorNoTokenProvided.throwHttp(req, res);
    }
  }
}
