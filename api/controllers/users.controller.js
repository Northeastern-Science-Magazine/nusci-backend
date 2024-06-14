dotenvConfig(); // load .env variables
import { config as dotenvConfig } from "dotenv";
import UsersAccessor from "../database_accessor/users.accessor.js";
import bcrypt from "bcryptjs"; // import bcrypt to hash passwords
import jwt from "jsonwebtoken"; // import jwt to sign tokens
import Authorize from "../auth/authorization.js";
import { UserPublicResponse, UserResponse } from "../api_models/user.js";
import { ErrorUserNotFound, ErrorValidation } from "../error/http_errors.js";

/**
 * UsersCTRL Class
 *
 * This class controls the behaviour of any web request
 * related to Users.
 */
export default class UsersCTRL {
  /**
   * apiPostLogin Method
   *
   * This method checks whether or not the request
   * to sign in is valid. Utilizes the getRegisteredByUsername
   * UserAccessor method to accomplish this.
   *
   * @param {HTTP REQ} req web request object
   * @param {HTTP RES} res web response
   * @param {function} next middleware function
   */
  static async apiPostLogin(req, res, next) {
    try {
      if (!req.cookies.token) {
        // check if the user is registered
        const user = await UsersAccessor.getRegisteredByUsername(req.body.username);
        if (user) {
          //check if password matches
          const result = await bcrypt.compare(req.body.password, user.password);
          if (result) {
            // check if the user has been deactivated
            const deactive = await user.deactivated;
            if (!deactive) {
              // sign token and send it in response
              const token = jwt.sign(
                {
                  username: user.username,
                  role: user.role,
                },
                process.env.TOKEN_KEY
              );

              //Users are logged in for 1 hour
              res.cookie("token", token, {
                httpOnly: true,
                maxAge: 60 * 60 * 1000,
              });
              res.redirect("/internal/my-profile");
            } else {
              throw ErrorUserNotFound.throwHttp(req, res);
            }
          } else {
            throw ErrorValidation.throwHttp(req, res);
          }
        } else {
          //check if the user is unregistered
          const unregistered = await UsersAccessor.getUnregisteredByUsername(req.body.username);
          if (unregistered) {
            throw ErrorUserNotFound.throwHttp(req, res);
          } else {
            //doesn't exist
            throw ErrorUserNotFound.throwHttp(req, res);
          }
        }
      } else {
        //already logged in
        throw new throwHttp(req, res);
      }
    } catch (e) {
      console.log(e);
      //something else went wrong
      throw new throwHttp(req, res);
    }
  }

  /**
   * apiPostSignUp Method
   *
   * This method adds a new user to the unregistered user
   * collection in the user database. It accomplishes this
   * by calling the user.accessor.js file and creating a new
   * user with the existing req data.
   *
   * @param {HTTP REQ} req web request information for signup
   * @param {HTTP RES} res web response object
   * @param {function} next middleware function
   */
  static async apiPostSignUp(req, res, next) {
    try {
      // hash the password
      req.body.password = await bcrypt.hash(req.body.password, 10);

      // make sure nested data is structured properly
      req.body.information = {
        year: req.body.year,
        major: req.body.major,
        bio: req.body.bio,
        image: req.body.image,
      };

      const registered = await UsersAccessor.getRegisteredByUsername(req.body.username);
      const unregistered = await UsersAccessor.getUnregisteredByUsername(req.body.username);

      if (!registered && !unregistered) {
        await UsersAccessor.createUser(req.body);
        res.redirect("/login");
      } else {
        throw new throwHttp(req, res);
      }
    } catch (e) {
      console.log(e);
      throw ErrorUserNotFound.throwHttp(req, res);
    }
  }

  /**
   * postDeactivateProfile Method
   *
   * This method dispatches to the user accessor where the username passed
   * from the Auth getUsername() method is then deactivated.
   *
   * @param {HTTP REQ} req web request information for signup
   * @param {HTTP RES} res web response object
   */
  static async postDeactivateProfile(req, res) {
    try {
      await UsersAccessor.deactivateUserByUsername(Authorize.getUsername(req));
      res.redirect("/logout");
    } catch (e) {
      throw ErrorUserNotFound.throwHttp(req, res);
    }
  }

  /**
   * postDeleteProfile Method
   *
   * This method dispatches to the user accessor where the username passed
   * from the Auth getUsername() method is then deleted and so is all associated work.
   *
   * @param {HTTP REQ} req web request information for signup
   * @param {HTTP RES} res web response object
   */
  static async postDeleteProfile(req, res) {
    try {
      await UsersAccessor.deleteUserByUsername(Authorize.getUsername(req));
      res.redirect("/logout");
    } catch (e) {
      throw ErrorUserNotFound.throwHttp(req, res);
    }
  }

  /**
   * getMyProfile Method
   *
   * This method retrieves the profile of the logged-in user.
   *
   * @param {HTTP REQ} req web request object
   * @param {HTTP RES} res web response object
   * @param {function} next middleware function
   */
  static async getMyProfile(req, res, next) {
    try {
      const username = Authorize.getUsername(req);
      const user = await UsersAccessor.getUserByUsername(username);

      if (!user) {
        throw ErrorUserNotFound.throwHttp(req, res);
      }

      const userProfile = new UserResponse(user.toObject());
      res.json(userProfile);
    } catch (e) {
      throw new throwHttp(req, res);
    }
  }

  /**
   * getPublicProfile Method
   *
   * This method retrieves the public profile of a user by their username.
   *
   * @param {HTTP REQ} req web request object
   * @param {HTTP RES} res web response object
   * @param {function} next middleware function
   */
  static async getPublicProfile(req, res, next) {
    try {
      const username = req.params.username;
      const user = await UsersAccessor.getUserByUsername(username);

      if (!user) {
        throw ErrorUserNotFound.throwHttp(req, res);
      }

      const publicUser = new UserPublicResponse(user.toObject());
      res.json(publicUser);
    } catch (e) {
      throw ErrorValidation;
    }
  }
}
