import { config as dotenvConfig } from "dotenv";
import UsersAccessor from "../databaseAccessors/userAccessor.js";
import bcrypt from "bcrypt"; // import bcrypt to hash passwords
import jwt from "jsonwebtoken"; // import jwt to sign tokens
import Authorize from "../auth/authorization.js";
import Accounts from "../models/enums/accounts.js";
import AccountStatus from "../models/enums/accountStatus.js";
import * as z from "zod";
import { Login, UserCreate, UserApprovals, UserPrivateResponse, UserPublicResponse } from "../models/zodSchemas/user.js";

import {
  ErrorFailedLogin,
  ErrorNotLoggedIn,
  ErrorUnexpected,
  ErrorUserAlreadyExists,
  ErrorUserAlreadyLoggedIn,
  ErrorUserDeactivatedLogin,
  ErrorUserDeniedLogin,
  ErrorUserNotFound,
  ErrorUserPendingLogin,
  ErrorUserStatusAlreadyResolved,
  ErrorValidation,
  HttpError,
} from "../error/errors.js";
import { string, date, array, integer } from "../models/validationSchemas/schemaTypes.js";
import Validate from "../models/validationSchemas/validateSchema.js";
import { userPublicResponse, userResponse } from "../models/validationSchemas/user.js";

/**
 * UsersController Class
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
      // parse login request
      if (!Login.safeParse(req.body)) {
        throw new ErrorFailedLogin("Bad Request Body");
      }

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
      //check if the user is pending
      if (user.status == AccountStatus.Pending.toString()) {
        throw new ErrorUserPendingLogin();
      }
      //check if the user is deactivated
      if (user.status == AccountStatus.Deactivated.toString()) {
        throw new ErrorUserDeactivatedLogin();
      }
      //check if the user is denied
      if (user.status == AccountStatus.Denied.toString()) {
        throw new ErrorUserDeniedLogin();
      }
      //check if password matches
      /**
       * @TODO unhashed passwords should not be sent over HTTP
       * We need to change the login flow to accept a hashed PW from FE,
       * and decrypt both here to verify using same key.
       */
      const decrypted = await bcrypt.compare(req.body.password, user.password);
      if (!decrypted) {
        throw new ErrorFailedLogin();
      }
      dotenvConfig(); // load .env variables
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

      let user = {...req.body, creationTime: new Date(), modificationTime: new Date()};
      const userCreate = await UserCreate.safeParseAsync(user);
      if (!userCreate.success) {
        throw new ErrorValidation("Signup validation failed.");
      }

      // hash the password
      /**
       * @TODO Password hashing should actually be deferred to FE. It is
       * generally unsafe to send unhashed passwords over HTTP
       */
      userCreate.data.password = await bcrypt.hash(userCreate.data.password, 10);
      const userByEmail = await UsersAccessor.getUserByEmail(userCreate.data.email);

      if (userByEmail) {
        throw new ErrorUserAlreadyExists();
      }

      await UsersAccessor.createUser(userCreate.data);
      res.status(201).json({ message: "Signup successful." });
    } catch (e) {
      if (e instanceof z.ZodError) {
        throw new ErrorValidation("Signup request validation failed.");
      }
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
   * This method dispatches to the user accessor where the email passed
   * from the Auth getEmail() method is then deactivated.
   *
   * @param {HTTP REQ} req web request information for signup
   * @param {HTTP RES} res web response object
   */
  // static async deactivateUser(req, res) {
  //   try {
  //     await UsersAccessor.deactivateUserByEmail(Authorize.getEmail(req));
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
   * @TODO FIX
   *
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
   */
  static async getMyProfile(req, res) {
    try {
      const email = Authorize.getEmail(req);
      const user = await UsersAccessor.getUserByEmail(email).then((_) => _?.toObject());

      if (!user) {
        throw new ErrorUserNotFound();
      }

      const userResponse = await UserPrivateResponse.omit({id: true}).safeParseAsync(user);
      if (!userResponse.success) {
        throw new ErrorValidation("Outgoing response validation failed");
      }

      res.status(200).json(userResponse.data);
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
   */
  static async getPublicUserByEmail(req, res) {
    try {
      const email = req.params.email;
      const user = await UsersAccessor.getUserByEmail(email).then((_) => _?.toObject());

      if (!user) {
        //return the user not found error here: or else ErrorValidation will also be
        // thrown due to null response from getUserByEmail when using .toObject() on null.
        throw new ErrorUserNotFound();
      }
      
      const userResponse = await UserPublicResponse.omit({id: true}).safeParseAsync(user);
      if (!userResponse.success) {
        throw new ErrorValidation("Outgoing response validation failed.");
      }

      res.status(200).json(userResponse.data);
    } catch (e) {
      console.log(e.message)
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
   */
  static async resolveUserApprovals(req, res) {
    try {

      const approvals = UserApprovals.safeParse(req.body);
      if (!approvals.success) {
        throw new ErrorValidation("Approvals validation failed.");
      }

      const approveUsers = approvals.data.approve ?? [];
      const denyUsers = approvals.data.deny ?? [];
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

  /**
   * @TODO FIX
   *
   * @param {HTTP REQ} req
   * @param {HTTP RES} res
   */
  // static async updateUser(req, res) {
  //   try {
  //     Validate.incoming(req.body, {
  //       email: { type: string, required: true },
  //       role: { type: string, required: true },
  //       information: {
  //         type: object,
  //         properties: {
  //           year: { type: integer },
  //           major: { type: string },
  //           bio: { type: string },
  //           image: { type: string },
  //         },
  //       },
  //     });

  //     // Update the password if provided (might be a nifty feature for the future)
  //     if (req.body.password) {
  //       req.body.password = await bcrypt.hash(req.body.password, 10);
  //     }

  //     // Update the user in the database
  //     const updatedUserData = await UsersAccessor.updateUser(updatedUser);
  //     if (!updatedUserData) {
  //       // Handle case where the user is not found
  //       throw new ErrorUserNotFound();
  //     }

  //     res.status(200).json(updatedUserData);
  //   } catch (e) {
  //     if (e instanceof HttpError) {
  //       e.throwHttp(req, res);
  //     } else {
  //       new ErrorUnexpected(e.message).throwHttp(req, res);
  //     }
  //   }
  // }

  /**
   * Gets the currently signed in user's role.
   *
   * Used for FE Middleware Authentication
   *
   * @param {HTTP REQ} req
   * @param {HTTP RES} res
   */
  static getMyRoles(req, res) {
    try {
      const roles = Authorize.getRoles(req, res);
      res.json({ roles: roles });
    } catch (e) {
      if (e instanceof ErrorNotLoggedIn || e instanceof ErrorFailedLogin) {
        // No Role
        res.json({ roles: [] });
      } else if (e instanceof HttpError) {
        // Some other error
        e.throwHttp(req, res);
      } else {
        new ErrorUnexpected(e.message).throwHttp(req, res);
      }
    }
  }

  /**
   * Removes the user's login cookie from browser.
   *
   * @param {HTTP REQ} req
   * @param {HTTP RES} res
   */
  static logout(req, res) {
    res.clearCookie("token");
    res.status(200).json({ message: "Successfully logged out." });
  }
}
