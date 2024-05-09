import { ErrorInternalAPIModelValidation } from "../error/internal_errors.js";
import AccountStatus from "../models/enums/account_status.js";
import Accounts from "../models/enums/accounts.js";
import BaseModel from "./base_model.js";

class UserBase extends BaseModel {
  /**
   * The full JSON of this UserModel
   *
   * @returns {Object}
   *
   */
  toJSON() {
    return {
      firstName: this.firstName,
      lastName: this.lastName,
      username: this.username,
      pronouncs: this.pronouns,
      graduationYear: this.graduationYear,
      majors: this.majors,
      location: this.location,
      profileImage: this.profileImage,
      bannerImage: this.bannerImage,
      bio: this.bio,
      emails: this.emails,
      phone: this.phone,
      roles: this.roles,
      status: this.status,
      approvingUser: this.approvingUser,
      gameData: this.gameData,
      creationTime: this.creationTime,
      modificationTime: this.modificationTime,
    };
  }
}

/**
 * API Model for creating a user.
 */
export class UserCreate extends UserBase {
  constructor(json) {
    super();
    this.firstName = json.firstName;
    this.lastName = json.lastName;
    this.username = json.username;
    this.pronouns = json.pronouns;
    this.graduationYear = json.graduationYear;
    this.majors = json.majors;
    this.location = json.location;
    this.profileImage = undefined;
    this.bannerImage = undefined;
    this.bio = json.bio;
    this.emails = json.emails;
    this.phone = json.phone ? json.phone : undefined;
    this.roles = json.roles;
    this.status = AccountStatus.Pending;
    this.approvingUser = undefined;
    this.gameData = undefined;
    this.creationTime = Date.now();
    this.modificationTime = Date.now();
  }

  /**
   * Validates the given JSON and returns the
   * API Model if properly validated.
   *
   * @param {Object} json
   * @returns {UserCreate}
   */
  validateModel(json) {
    try {
      const userCreateSchema = {
        firstName: { type: "string", required: true },
        lastName: { type: "string", required: true },
        username: { type: "string", required: true },
        pronouns: { type: ["string"], required: false },
        graduationYear: { type: "number", required: true },
        majors: { type: ["string"], required: false },
        location: { type: "string", required: false },
        bio: { type: "string", required: true },
        emails: { type: ["string"], required: true },
        phone: { type: "string", required: false },
        roles: { type: Accounts.allStr, required: true },
      };
      BaseModel.validateModel(json, userCreateSchema);
      return new UserCreate(json);
    } catch (e) {
      throw new ErrorInternalAPIModelValidation();
    }
  }
}

/**
 * API Model for sending a user to a caller.
 */
export class UserResponse extends UserBase {}

/**
 * API Model for sending a user to a caller with no private data.
 */
export class UserPublicResponse extends UserBase {}
