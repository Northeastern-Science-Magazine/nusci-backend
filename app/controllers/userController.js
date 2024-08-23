dotenvConfig(); // load .env variables
import { config as dotenvConfig } from "dotenv";
import UsersAccessor from "../databaseAccessors/userAccessor.js";
import bcrypt from "bcryptjs"; // import bcrypt to hash passwords
import jwt from "jsonwebtoken"; // import jwt to sign tokens
import Authorize from "../auth/authorization.js";
import { UserCreate, UserPublicResponse, UserResponse } from "../models/apiModels/user.js";
import {
  ErrorUserLoggedIn,
  ErrorUserNotFound,
  ErrorUserPending,
  ErrorUserAlreadyExists,
  ErrorValidation,
  ErrorUserDeactivated,
  ErrorUserDenied,
  ErrorLoginInformation,
  ErrorUnexpected,
} from "../error/httpErrors.js";
import AccountStatus from "../models/enums/accountStatus.js";

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
   * to sign in is valid. Utilizes the getApprovedByUsername
   * UserAccessor method to accomplish this.
   *
   * @param {HTTP REQ} req web request object
   * @param {HTTP RES} res web response
   * @param {function} next middleware function
   */
  static async login(req, res, next) {
    try {
      if (req.cookies.token) {
        // already logged in
        return ErrorUserLoggedIn.throwHttp(req, res);
      }

      // check if the user exists and is approved
      const user = await UsersAccessor.getUserByUsername(req.body.username);

      if (!user) {
        //doesn't exist
        return ErrorUserNotFound.throwHttp(req, res);
      }

      if (user.status == AccountStatus.Pending.toString()) {
        //check if the user is pending
        return ErrorUserPending.throwHttp(req, res);
      }

      if (user.status == AccountStatus.Deactivated.toString()) {
        //check if the user is deactivated
        return ErrorUserDeactivated.throwHttp(req, res);
      }

      if (user.status == AccountStatus.Denied.toString()) {
        //check if the user is denied
        return ErrorUserDenied.throwHttp(req, res);
      }

      //check if password matches
      const decrypted = await bcrypt.compare(req.body.password, user.password);
      if (!decrypted) {
        return ErrorLoginInformation.throwHttp(req, res);
      }

      // sign token and send it in response
      const token = jwt.sign(
        {
          username: user.username,
          roles: user.roles,
        },
        process.env.SERVER_TOKEN_KEY
      );

      //Users are logged in for 1 hour
      res.cookie("token", token, { httpOnly: true, maxAge: 60 * 60 * 1000 });
      res.status(200).json({ message: "Login successful." });
    } catch (e) {
      ErrorUnexpected.throwHttp(req, res);
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
      // validate incoming data using UserCreate model
      const userData = new UserCreate(req.body);

      // hash the password
      userData.password = await bcrypt.hash(userData.password, 10);

      const userByUsername = await UsersAccessor.getUserByUsername(userData.username);
      const userByEmail = await UsersAccessor.getUserByEmail(userData.emails[0]);

      if (userByUsername || userByEmail) {
        return ErrorUserAlreadyExists.throwHttp(req, res);
      }

      await UsersAccessor.createUser(userData);
      res.status(201).json({ message: "Signup successful." });
    } catch (e) {
      return ErrorUnexpected.throwHttp(req, res);
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
        return ErrorUserNotFound.throwHttp(req, res);
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
  static async getPublicUserByUsername(req, res, next) {
    try {
      const username = req.params.username;
      const user = await UsersAccessor.getUserByUsername(username);

      if (!user) {
        //return the user not found error here: or else ErrorValidation will also be
        // thrown due to null response from getUserByUsername when using .toObject() on null.
        return ErrorUserNotFound.throwHttp(req, res);
      }

      const publicUser = new UserPublicResponse(user.toObject());
      res.status(200).json(publicUser);
    } catch (e) {
      ErrorValidation.throwHttp(req, res);
    }
  }

  /**
   * resolveUserApprovals Method
   *
   * This method updates the status of lists of pending users to deny or approve them.
   *
   * @param {HTTP REQ} req web request object, contains 2 lists of usernames to approve or deniy.
   * @param {HTTP RES} res web response object.
   * @param {function} next middleware function.
   */
  static async resolveUserApprovals(req, res, next) {
    if (!(req.body.approve && req.body.deny)) {
      ErrorValidation.throwHttp(req, res);
    } else {
      try {
        const approveUsers = req.body.approve ?? [];
        const denyUsers = req.body.deny ?? [];
        const allUsers = [...approveUsers, ...denyUsers];

        //check if the users given exists and are pending
        for (const username of allUsers) {
          //check if the user exists and is pending
          try {
            const user = await UsersAccessor.getUserByUsername(username);

            if (user.status !== AccountStatus.Pending.toString()) {
              return ErrorValidation.throwHttp(req, res);
            }
          } catch (e) {
            return ErrorUserNotFound.throwHttp(req, res);
          }
        }

        //approve the users
        for (const username of approveUsers) {
          await UsersAccessor.approveUserByUsername(username);
        }

        //deny the users
        for (const username of denyUsers) {
          await UsersAccessor.denyUserByUsername(username);
        }

        res.status(201).json({ message: "All users resolved successfully." });
      } catch (e) {
        console.log(e);
        return ErrorUserNotFound.throwHttp(req, res);
      }
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
    res.json({ message: "Successfully logged out." });
  }
}
