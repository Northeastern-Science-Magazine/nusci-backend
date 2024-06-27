import UsersAccessor from "../database_accessor/users.accessor.js";
import { ErrorUserNotFound, ErrorValidation } from "../error/http_errors.js";

/**
 * This file controls routes from the public pages routes file.
 */

export default class PublicPagesController {


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
        ErrorUserNotFound.throwHttp(req, res);
      }

      res.redirect("/my-profile");
    } catch (e) {
      console.log(e);
      ErrorValidation.throwHttp(req, res);
    }
  }

  static getLogout(req, res) {
    res.clearCookie("token");
    res.redirect("/");
    console.log("Signed out");
  }
}
