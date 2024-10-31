import UsersAccessor from "../database_accessor/users.accessor.js";
import Authorize from "../auth/authorization.js";
import Errors from "../error/errors.js";
import handleError from "../error/error.handler.js";

/**
 * This file controls routes from the public pages routes file.
 */

export default class PublicPagesController {
  static getLogin(req, res) {
    if (req.cookies.token) {
      res.redirect("/profile");
    } else {
      res.render("login", { error: req.cookies.error });
    }
  }

  static getError(req, res, next) {
    //if the user requests the error page and an error doesn't exist, redirect to main
    if (req.cookies.error) {
      res.render("error", { error: req.cookies.error });
    } else {
      res.redirect("/");
    }
  }

  static async getProfile(req, res, next) {
    try {
      const user = await UsersAccessor.getRegisteredByUsername(Authorize.getUsername(req));
      console.log(user);
      res.render("profile", {
        name: user.username,
        role: user.role,
        year: user.information.year,
        major: user.information.major,
        bio: user.information.bio,
      });
    } catch (e) {
      return handleError(res, Errors[500].DataGET);
    }
  }

  static async getEditProfile(req, res, next) {
    try {
      const user = await UsersAccessor.getRegisteredByUsername(Authorize.getUsername(req));

      res.render("edit_profile", {
        name: user.username,
        role: user.role,
        year: user.information.year,
        major: user.information.major,
        bio: user.information.bio,
      });
    } catch (e) {
      return handleError(res, Errors[500].DataGET);
    }
  }

  static async putEditProfile(req, res, next) {
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
        return handleError(res, Errors[404].UserNotFound);
      }

      res.redirect("/profile");
    } catch (e) {
      console.log(e);
      return handleError(res, Errors[500].DataPUT);
    }
  }

  static getLogout(req, res) {
    res.clearCookie("token");
    res.redirect("/");
    console.log("Signed out");
  }
}
