import { config as dotenvConfig } from "dotenv";
import UsersAccessor from "../databaseAccessors/userAccessor.js";
import Authorize from "../auth/authorization.js";
import AccountStatus from "../models/enums/accountStatus.js";
import {
  Login,
  UserCreate,
  UserInvite,
  UserSignup,
  SelfProfileUpdate,
  UserApprovals,
  UserPrivateResponse,
  UserPublicResponse,
} from "../models/zodSchemas/user.js";
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
  ErrorInvalidInvite,
  HttpError,
} from "../error/errors.js";
import LoginToken from "../auth/token.js";
import Password from "../auth/password.js";
import OTPAccessor from "../databaseAccessors/otpAccessor.js";
import EmailAccessor from "../databaseAccessors/emailAccessor.js";
import { GenerateEmail, ResendEmail } from "../services/email/emailService.js";
import Accounts from "../models/enums/accounts.js";

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

      // Only a valid token counts; an invalid cookie is overwritten by the new one.
      if (Authorize.isLoggedIn(req)) {
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
      const decrypted = await Password.compare(req.body.password, user.password);
      if (!decrypted) {
        throw new ErrorFailedLogin(user);
      }
      dotenvConfig(); // load .env variables

      // sign token and send it in response
      res.cookie(...LoginToken.generate(user));
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
   * sendInvites Method
   *
   * This method sends a single-use signup invite to each given
   * email that does not already have an account.
   *
   * @param {HTTP REQ} req web request object, contains the emails and roles to invite
   * @param {HTTP RES} res web response object
   */
  static async sendInvites(req, res) {
    try {
      const invite = UserInvite.safeParse(req.body);
      if (!invite.success) {
        throw new ErrorValidation("Invite validation failed.");
      }

      const inviter = await UsersAccessor.getUserIdByEmail(Authorize.getEmail(req));
      const invited = [];
      const skipped = [];
      const failed = [];

      // Set removes duplicates so one request never sends someone two invites.
      for (const email of new Set(invite.data.to)) {
        try {
          if (await UsersAccessor.getUserByEmail(email)) {
            skipped.push(email);
            continue;
          }

          const inviteEmail = await GenerateEmail.InviteUser({
            to: [email],
            roles: invite.data.roles,
            invitedBy: inviter._id,
          });
          await ResendEmail.sendEmailWithTemplate(inviteEmail);
          // The url holds the raw token, so it is left out of the stored record.
          await EmailAccessor.createEmail({ ...inviteEmail, variables: {} });
          invited.push(email);
        } catch (e) {
          // One failed address does not stop the rest of the list.
          failed.push(email);
        }
      }

      res.status(200).json({ invited: invited, skipped: skipped, failed: failed });
    } catch (e) {
      if (e instanceof HttpError) {
        e.throwHttp(req, res);
      } else {
        new ErrorUnexpected(e.message).throwHttp(req, res);
      }
    }
  }

  /**
   * getInvite Method
   *
   * This method returns the email an invite belongs to, so the
   * signup page can show it. It does not use up the invite.
   *
   * @param {HTTP REQ} req web request object, contains the token query
   * @param {HTTP RES} res web response object
   */
  static async getInvite(req, res) {
    try {
      const { token } = req.query;
      // ?token=a&token=b arrives as an array, which cannot be hashed.
      if (typeof token !== "string") {
        throw new ErrorInvalidInvite();
      }

      const otpRecord = await OTPAccessor.findValidOTP(token, "invite");
      if (!otpRecord) {
        throw new ErrorInvalidInvite();
      }

      res.status(200).json({ email: otpRecord.email });
    } catch (e) {
      if (e instanceof HttpError) {
        e.throwHttp(req, res);
      } else {
        new ErrorUnexpected(e.message).throwHttp(req, res);
      }
    }
  }

  /**
   * signup Method
   *
   * This method creates an approved account from an invite and
   * logs the new user in.
   *
   * @param {HTTP REQ} req web request object, contains the token, password, and name fields
   * @param {HTTP RES} res web response object
   */
  static async signup(req, res) {
    try {
      const signup = UserSignup.safeParse(req.body);
      if (!signup.success) {
        throw new ErrorValidation("Signup validation failed.");
      }

      // Only a valid token counts; an invalid cookie is overwritten by the new one.
      if (Authorize.isLoggedIn(req)) {
        throw new ErrorUserAlreadyLoggedIn();
      }

      const { token, password, firstName, lastName, graduationYear } = signup.data;
      const invite = await OTPAccessor.verifyOTPRecord(token, "invite");
      if (!invite.success) {
        throw new ErrorInvalidInvite();
      }

      // The invite stays used here, since this email can no longer sign up anyway.
      if (await UsersAccessor.getUserByEmail(invite.email)) {
        throw new ErrorUserAlreadyExists();
      }

      let user;
      try {
        const userCreate = UserCreate.safeParse({
          firstName: firstName,
          lastName: lastName,
          graduationYear: graduationYear,
          // Email, roles, and approver come from the invite, never the request body.
          email: invite.email,
          roles: [...invite.roles],
          status: AccountStatus.Approved.toString(),
          approvingUser: invite.invitedBy?.toString(),
          password: await Password.hash(password, 10),
          creationTime: new Date(),
          modificationTime: new Date(),
        });
        if (!userCreate.success) {
          throw new ErrorUnexpected("Invite produced an invalid user.");
        }
        user = await UsersAccessor.createUser(userCreate.data);
      } catch (e) {
        // Server-side failure, so give the invite back for a retry.
        await OTPAccessor.releaseOTPRecord(token);
        throw e;
      }

      res.cookie(...LoginToken.generate(user));
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

      if (user.approvingUser) {
        user.approvingUser = user.approvingUser.toString();
      }

      const userResponse = await UserPrivateResponse.omit({ id: true, password: true }).safeParseAsync(user);
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
   * updateMyProfile Method
   *
   * This method updates the profile of the logged-in user with the
   * given fields and returns the updated profile.
   *
   * @param {HTTP REQ} req web request object
   * @param {HTTP RES} res web response object
   */
  static async updateMyProfile(req, res) {
    try {
      const email = Authorize.getEmail(req);

      const update = await SelfProfileUpdate.safeParseAsync({ ...req.body, modificationTime: new Date() });
      if (!update.success) {
        throw new ErrorValidation("Update profile validation failed.");
      }

      const user = await UsersAccessor.updateUserByEmail(email, update.data).then((_) => _?.toObject());
      if (!user) {
        throw new ErrorUserNotFound();
      }

      if (user.approvingUser) {
        user.approvingUser = user.approvingUser.toString();
      }

      const userResponse = await UserPrivateResponse.omit({ id: true, password: true }).safeParseAsync(user);
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

      const userResponse = await UserPublicResponse.omit({ id: true }).safeParseAsync(user);
      if (!userResponse.success) {
        throw new ErrorValidation("Outgoing response validation failed.");
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

  /**
   * Verifies the OTP
   *
   * @param {HTTP REQ} req
   * @param {HTTP RES} res
   */
  static async verifyOTPLink(req, res) {
    try {
      const { token } = req.query;
      if (!token) {
        throw new ErrorFailedLogin();
      }

      const { success, email } = await OTPAccessor.verifyOTPRecord(token, "login");

      if (!success) {
        throw new ErrorFailedLogin();
      }

      const user = await UsersAccessor.getUserByEmail(email);

      if (!user) {
        throw new ErrorFailedLogin();
      }

      res.cookie(...LoginToken.generate(user));
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
   * Gets a basic list of all users
   * name (full)
   * email
   *
   * Used for dropdowns etc in FE
   *
   * @param {Request} req
   * @param {Response} res
   */
  static async getBasicUserList(req, res) {
    try {
      const users = await UsersAccessor.getUserByRole(Accounts.Author.role);
      const basicUsers = users.map((user) => {
        return {
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
        };
      });
      res.status(200).json(basicUsers);
    } catch (e) {
      if (e instanceof HttpError) {
        e.throwHttp(req, res);
      } else {
        new ErrorUnexpected(e.message).throwHttp(req, res);
      }
    }
  }
}
