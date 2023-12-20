import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import PermissionSet from "./permissions.js";

/**
 * Authorize Class
 *
 * This class authorizes requests to pages with restrictions.
 * The lowest to highest authorization is as follows:
 * 1. Author
 * 2. Editor
 * 3. Developer
 * 4. Admin
 * Each subsequent level can access everything the previous level can access.
 */
export default class Authorize {
  /**
   * auth Method
   *
   * If the user is logged in, this method will call the next
   * http method in line. If not, this method will redirect the
   * user to be logged in.
   *
   * @param {*} req http request
   * @param {*} res http response
   * @param {*} next http method
   * @param {*} role role to be authorized
   */
  static auth(req, res, next, route) {
    dotenv.config();
    if (req.cookies.token) {
      const payload = jwt.verify(req.cookies.token, process.env.TOKEN_KEY);
      if (payload) {
        const userPermissionLevel = Authorize.roleToLevel(payload.role);
        const requestedPermissionLevel = Authorize.roleToLevel(role);

        if (userPermissionLevel >= requestedPermissionLevel) {
          req.user = payload;
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
}
