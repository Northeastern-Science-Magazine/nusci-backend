dotenvConfig(); // load .env variables
import { config as dotenvConfig } from "dotenv";
import UsersAccessor from "../databaseAccessors/userAccessor.js";
import bcrypt from "bcryptjs"; // import bcrypt to hash passwords
import jwt from "jsonwebtoken"; // import jwt to sign tokens
import Authorize from "../auth/authorization.js";
import { UserCreate, UserPublicResponse, UserResponse } from "../models/apiModels/user.js";
import AccountStatus from "../models/enums/accountStatus.js";
import {
  ErrorFailedLogin,
  ErrorUnexpected,
  ErrorUserAlreadyExists,
  ErrorUserAlreadyLoggedIn,
  ErrorUserDeactivatedLogin,
  ErrorUserDeniedLogin,
  ErrorUserNotFound,
  ErrorUserPendingLogin,
  ErrorUserStatusAlreadyResolved,
  HttpError,
} from "../error/errors.js";

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
   * @param {HTTP RES} reply web response
   * @param {function} next middleware function
   */
  static async login(req, reply, next) {
    try {
      if (req.cookies.token) {
        // already logged in
        throw new ErrorUserAlreadyLoggedIn();
      }

      // check if the user exists and is approved
      const user = await UsersAccessor.getUserByUsername(req.body.username);

      if (!user) {
        //doesn't exist (use generic message)
        throw new ErrorFailedLogin();
      }

      if (user.status == AccountStatus.Pending.toString()) {
        //check if the user is pending
        throw new ErrorUserPendingLogin();
      }

      if (user.status == AccountStatus.Deactivated.toString()) {
        //check if the user is deactivated
        throw new ErrorUserDeactivatedLogin();
      }

      if (user.status == AccountStatus.Denied.toString()) {
        //check if the user is denied
        throw new ErrorUserDeniedLogin();
      }

      //check if password matches
      const decrypted = await bcrypt.compare(req.body.password, user.password);
      if (!decrypted) {
        throw new ErrorFailedLogin();
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
      reply.cookie("token", token, { httpOnly: true, maxAge: 60 * 60 * 1000 });
      reply.status(200).send({ message: "Login successful." });
    } catch (e) {
      if (e instanceof HttpError) {
        e.throwHttp(req, reply);
      } else {
        new ErrorUnexpected(e.message).throwHttp(req, reply);
      }
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
        throw new ErrorUserAlreadyExists();
      }

      await UsersAccessor.createUser(userData);
      res.status(201).json({ message: "Signup successful." });
    } catch (e) {
      if (e instanceof HttpError) {
        e.throwHttp(req, res);
      } else {
        new ErrorUnexpected(e.message).throwHttp(req, res);
      }
    }
  }

  /**
   * @TODO fix this method
   *
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
      if (e instanceof HttpError) {
        e.throwHttp(req, res);
      } else {
        new ErrorUnexpected(e.message).throwHttp(req, res);
      }
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
      if (e instanceof HttpError) {
        e.throwHttp(req, res);
      } else {
        new ErrorUnexpected(e.message).throwHttp(req, res);
      }
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
        throw new ErrorUserNotFound();
      }

      const userProfile = new UserResponse(user.toObject());
      res.json(userProfile);
    } catch (e) {
      if (e instanceof HttpError) {
        e.throwHttp(req, res);
      } else {
        new ErrorUnexpected(e.message).throwHttp(req, res);
      }
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
        throw new ErrorUserNotFound();
      }

      const publicUser = new UserPublicResponse(user.toObject());
      res.status(200).json(publicUser);
    } catch (e) {
      if (e instanceof HttpError) {
        e.throwHttp(req, res);
      } else {
        new ErrorUnexpected(e.message).throwHttp(req, res);
      }
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
    try {
      if (!(req.body.approve && req.body.deny)) {
        throw new ErrorValidation("No users given to resolve status for.");
      }

      const approveUsers = req.body.approve ?? [];
      const denyUsers = req.body.deny ?? [];
      const allUsers = [...approveUsers, ...denyUsers];

      //check if the users given exists and are pending
      for (const username of allUsers) {
        //check if the user exists and is pending
        try {
          const user = await UsersAccessor.getUserByUsername(username);

          if (user.status !== AccountStatus.Pending.toString()) {
            throw new ErrorUserStatusAlreadyResolved();
          }
        } catch (e) {
          throw new ErrorUserNotFound();
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
      if (e instanceof HttpError) {
        e.throwHttp(req, res);
      } else {
        new ErrorUnexpected(e.message).throwHttp(req, res);
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
        throw new ErrorUserNotFound();
      }

      res.json(updatedUserData);
    } catch (e) {
      if (e instanceof HttpError) {
        e.throwHttp(req, res);
      } else {
        new ErrorUnexpected(e.message).throwHttp(req, res);
      }
    }
  }

  static logout(req, res) {
    res.clearCookie("token");
    res.json({ message: "Successfully logged out." });
  }
}
