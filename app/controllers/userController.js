dotenvConfig(); // load .env variables
import { config as dotenvConfig } from "dotenv";
import UsersAccessor from "../databaseAccessors/userAccessor.js";
import bcrypt from "bcryptjs"; // import bcrypt to hash passwords
import jwt from "jsonwebtoken"; // import jwt to sign tokens
import Authorize from "../auth/authorization.js";
import { UserPublicResponse, UserResponse } from "../models/apiModels/user.js";
import {
  ErrorUserDeactivated,
  ErrorUserLoggedIn,
  ErrorUserNotFound,
  ErrorUserNotRegistered,
  ErrorValidation,
} from "../error/httpErrors.js";

/**
 * UsersCTRL Class
 *
 * This class controls the behaviour of any web request
 * related to Users.
 */
export default class UserController {
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
  static async login(req, res, next) {
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
                  roles: user.roles,
                },
                process.env.SERVER_TOKEN_KEY
              );

              //Users are logged in for 1 hour
              res.cookie("token", token, {
                httpOnly: true,
                maxAge: 60 * 60 * 1000,
              });
              res.redirect("/internal/my-profile");
            } else {
              ErrorValidation.throwHttp(req, res);
            }
          } else {
            ErrorUserDeactivated.throwHttp(req, res);
          }
        } else {
          //check if the user is unregistered
          const unregistered = await UsersAccessor.getUnregisteredByUsername(req.body.username);
          if (unregistered) {
            ErrorUserNotRegistered.throwHttp(req, res);
          } else {
            //doesn't exist
            ErrorUserNotFound.throwHttp(req, res);
          }
        }
      } else {
        //already logged in
        ErrorUserLoggedIn.throwHttp(req, res);
      }
    } catch (e) {
      console.log(e);
      //something else went wrong
      new throwHttp(req, res);
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
  static async signup(req, res, next) {
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
        ErrorValidation.throwHttp(req, res);
      }
    } catch (e) {
      console.log(e);
      ErrorValidation.throwHttp(req, res);
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
  static async deactivateUser(req, res) {
    try {
      await UsersAccessor.deactivateUserByUsername(Authorize.getUsername(req));
      res.redirect("/logout");
    } catch (e) {
      ErrorUserNotFound.throwHttp(req, res);
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
  static async deleteUser(req, res) {
    try {
      await UsersAccessor.deleteUserByUsername(Authorize.getUsername(req));
      res.redirect("/logout");
    } catch (e) {
      ErrorUserNotFound.throwHttp(req, res);
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
        ErrorUserNotFound.throwHttp(req, res);
      }

      const userProfile = new UserResponse(user.toObject());
      res.json(userProfile);
    } catch (e) {
      ErrorUserNotFound.throwHttp(req, res);
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
        ErrorUserNotFound.throwHttp(req, res);
      }

      const publicUser = new UserPublicResponse(user.toObject());
      res.json(publicUser);
    } catch (e) {
      ErrorValidation.throwHttp(req, res);
    }
  }

  static async updateUser(req, res, next) {
    try {
      // Update the user information
      const updatedUser = {
        username: req.body.name,
        role: req.body.role,
        information: {
          year: req.body.year,
          major: req.body.major,
          bio: req.body.bio,
          image: req.body.image,
        },
      };

      // Update the password if provided (might be a nifty feature for the future)
      if (req.body.password) {
        updatedUser.password = await bcrypt.hash(req.body.password, 10);
      }

      // Update the user in the database
      const updatedUserData = await UsersAccessor.updateUser(updatedUser);
      if (!updatedUserData) {
        // Handle case where the user is not found
        ErrorUserNotFound.throwHttp(req, res);
      }

      res.redirect("/my-profile");
    } catch (e) {
      console.log(e);
      ErrorValidation.throwHttp(req, res);
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
      ErrorUserNotFound.throwHttp(req, res);
    }
  }

  static logout(req, res) {
    res.clearCookie("token");
    res.redirect("/");
    console.log("Signed out");
  }
}
