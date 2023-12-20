import UsersAccessor from "../database_accessor/users.accessor.js";
import Authorize from "../auth/authorization.js";
/**
 * This file controlls routes that require functionality.
 */

export default class RoutesController {
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
    if (!req.error) {
      const user = await UsersAccessor.getRegisteredByUsername(Authorize.getUsername(req));
      console.log(user);
      res.render("profile", {
        name: user.username,
        role: user.role,
        year: user.information.year,
        major: user.information.major,
        bio: user.information.bio,
      });
    } else {
      next();
    }
  }

  static getLogout(req, res) {
    res.clearCookie("token");
    res.redirect("/");
    console.log("Signed out");
  }
}
