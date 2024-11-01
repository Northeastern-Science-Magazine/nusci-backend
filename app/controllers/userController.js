dotenvConfig(); // load .env variables
import { config as dotenvConfig } from "dotenv";
import UsersAccessor from "../databaseAccessors/userAccessor.js";
import bcrypt from "bcryptjs"; // import bcrypt to hash passwords
import jwt from "jsonwebtoken"; // import jwt to sign tokens
import Authorize from "../auth/authorization.js";
import Accounts from "../models/enums/accounts.js";
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
import { string, date, array, integer } from "../models/validationSchemas/schemaTypes.js";
import validateJSON from "../models/validationSchemas/validateJSON.js";
import { userResponse } from "../models/validationSchemas/user.js";

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
   * to sign in is valid. Utilizes the getApprovedByEmail
   * UserAccessor method to accomplish this.
   *
   * @param {HTTP REQ} req web request object
   * @param {HTTP RES} res web response
   */
  static async login(req, res) {
    try {
      console.log("pre-validation");
      const validation = validateJSON(req.body, {
        email: { type: string, required: true },
        password: { type: string, required: true },
      });

      if (req.cookies.token) {
        // already logged in
        throw new ErrorUserAlreadyLoggedIn();
      }

      // check if the user exists and is approved
      const user = await UsersAccessor.getUserByEmail(req.body.email);
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
          email: user.email,
          roles: user.roles,
        },
        process.env.SERVER_TOKEN_KEY
      );

      //Users are logged in for 1 hour
      res.cookie("token", token, { httpOnly: true, maxAge: 60 * 60 * 1000 });
      res.status(200).json({ message: "Login successful." });
    } catch (e) {
      console.log(e);
      if (e instanceof HttpError) {
        e.throwHttp(req, res);
      } else {
        new ErrorUnexpected(e.message).throwHttp(req, res);
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
   */
  static async signup(req, res) {
    try {
      validateJSON(
        req.body,
        {
          firstName: { type: string, required: true },
          lastName: { type: string, required: true },
          password: { type: string, required: true },
          pronouns: { type: array, items: { type: string } },
          graduationYear: { type: integer, required: true },
          major: { type: string },
          location: { type: string },
          profileImage: { type: string },
          bannerImage: { type: string },
          bio: { type: string, required: true },
          email: { type: string, required: true },
          phone: { type: string },
          roles: { type: array, items: { enum: Accounts.listr(), required: true } },
          status: { enum: AccountStatus.listr(), required: true },
          approvingUser: { const: undefined },
          gameData: { const: undefined },
          creationTime: { type: date, required: true },
          modificationTime: { type: date, required: true },
        },
        { override: ["creationTime", "modificationTime"] }
      );

      // hash the password
      req.body.password = await bcrypt.hash(req.body.password, 10);
      const userByEmail = await UsersAccessor.getUserByEmail(req.body.email);

      if (userByEmail) {
        throw new ErrorUserAlreadyExists();
      }

      await UsersAccessor.createUser(req.body);
      res.status(201).json({ message: "Signup successful." });
    } catch (e) {
      if (e instanceof HttpError) {
        e.throwHttp(req, res);
      } else {
        console.log(e);
        new ErrorUnexpected(e.message).throwHttp(req, res);
      }
    }
  }

  /**
   * @TODO fix this method
   *
   * postDeactivateProfile Method
   *
   * This method dispatches to the user accessor where the email passed
   * from the Auth getEmail() method is then deactivated.
   *
   * @param {HTTP REQ} req web request information for signup
   * @param {HTTP RES} res web response object
   */
  static async deactivateUser(req, res) {
    try {
      await UsersAccessor.deactivateUserByEmail(Authorize.getEmail(req));
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
   * This method dispatches to the user accessor where the email passed
   * from the Auth getEmail() method is then deleted and so is all associated work.
   *
   * @param {HTTP REQ} req web request information for signup
   * @param {HTTP RES} res web response object
   */
  // static async deleteUser(req, res) {
  //   try {
  //     await UsersAccessor.deleteUserByEmail(Authorize.getEmail(req));
  //     res.redirect("/logout");
  //   } catch (e) {
  //     if (e instanceof HttpError) {
  //       e.throwHttp(req, res);
  //     } else {
  //       new ErrorUnexpected(e.message).throwHttp(req, res);
  //     }
  //   }
  // }

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
      const email = Authorize.getEmail(req);
      const user = await UsersAccessor.getUserByEmail(email).toObject();

      if (!user) {
        throw new ErrorUserNotFound();
      }

      validate(user, userResponse);
      res.status(200).json(user);
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
   * This method retrieves the public profile of a user by their email.
   *
   * @param {HTTP REQ} req web request object
   * @param {HTTP RES} res web response object
   * @param {function} next middleware function
   */
  static async getPublicUserByEmail(req, res, next) {
    try {
      const email = req.params.email;
      const user = await UsersAccessor.getUserByEmail(email);
      if (!user) {
        //return the user not found error here: or else ErrorValidation will also be
        // thrown due to null response from getUserByEmail when using .toObject() on null.
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
   * @param {HTTP REQ} req web request object, contains 2 lists of emails to approve or deny.
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
      for (const email of allUsers) {
        //check if the user exists and is pending
        try {
          const user = await UsersAccessor.getUserByEmail(email);
          if (user.status !== AccountStatus.Pending.toString()) {
            throw new ErrorUserStatusAlreadyResolved();
          }
        } catch (e) {
          throw new ErrorUserNotFound();
        }
      }

      //approve the users
      for (const email of approveUsers) {
        await UsersAccessor.approveUserByEmail(email);
      }

      //deny the users
      for (const email of denyUsers) {
        await UsersAccessor.denyUserByEmail(email);
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
        email: req.body.email,
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
