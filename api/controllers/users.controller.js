dotenvConfig(); // load .env variables
import { config as dotenvConfig } from "dotenv";
import UsersAccessor from "../database_accessor/users.accessor.js";
import bcrypt from "bcryptjs"; // import bcrypt to hash passwords
import jwt from "jsonwebtoken"; // import jwt to sign tokens
import Errors from "../error/errors.js";
import handleError from "../error/error.handler.js";

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
              res.redirect("/internal/profile");
            } else {
              return handleError(res, Errors[400].Login.Deactivated);
            }

          } else {
            return handleError(res, Errors[400].Login.Password);
          }
        } else {
          //check if the user is unregistered
          const unregistered = await UsersAccessor.getUnregisteredByUsername(req.body.username);
          if (unregistered) {
            return handleError(res, Errors[400].Unregistered);
          } else {
            //doesn't exist
            return handleError(res, Errors[400].Login.Username);
          }
        }
      } else {
        //already logged in
        return handleError(res, Errors[400].Login.LoggedIn);
      }
    } catch (e) {
      console.log(e);
      //something else went wrong
      return handleError(res, Errors[400].BadRequest);
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
        return handleError(res, Errors[400].SignUp.Username);
      }
    } catch (e) {
      console.log(e);
      return handleError(res, Errors[500].DataPOST);
    }
  }

  static getDeactivateProfile(req, res) {
    res.render("deactivate", { error: req.cookies.error });
  }

  static async putDeactivateProfile(req, res) {
    try {
      await UsersAccessor.deactivateUserByUsername(Authorize.getUsername(req));
    } catch (e) {
      return handleError(res, Errors[500].DataGET);
    }
  }

  static getDeleteProfile(req, res) {
    res.render("delete", { error: req.cookies.error });
  }

  static async deleteDeleteProfile(req, res) {
    try {
      await UsersAccessor.deleteUserByUsername(Authorize.getUsername(req));
    } catch (e) {
      return handleError(res, Errors[500].DataGET);
    }
  }
}
