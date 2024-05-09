import { ErrorInternalAPIModelValidation } from "../error/internal_errors.js";
import AccountStatus from "../models/enums/account_status.js";
import Accounts from "../models/enums/accounts.js";
import { BaseModel } from "./base_model.js";
import { BaseModelUpdate } from "./base_model.js";

/**
 * Represents the http request body required
 * to create a user in the database.
 */
export class UserCreate extends BaseModel {
  static schema = {
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
    roles: { type: ["string"], enum: Accounts.allStr, required: true },
  };

  constructor(json) {
    try {
      super(json, UserCreate.schema);
    } catch (e) {
      throw new ErrorInternalAPIModelValidation(e.message);
    }
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
}

/**
 * Represents the http response body returned to a frontend.
 */
export class UserResponse extends BaseModel {
  static schema = {
    firstName: { type: "string", required: true },
    lastName: { type: "string", required: true },
    username: { type: "string", required: true },
    pronouns: { type: ["string"], required: false },
    graduationYear: { type: "number", required: true },
    majors: { type: ["string"], required: false },
    location: { type: "string", required: false },
    profileImage: { type: "string", required: false },
    bannerImage: { type: "string", required: false },
    bio: { type: "string", required: true },
    emails: { type: ["string"], required: true },
    phone: { type: "string", required: false },
    roles: { type: ["string"], enum: Accounts.allStr, required: true },
    status: { type: "string", enum: AccountStatus.allStr, required: true },
    approvingUser: {
      type: {
        firstName: { type: "string", required: false },
        lastName: { type: "string", required: false },
        username: { type: "string", required: false },
        roles: { type: Accounts.allStr, required: false },
        status: { type: "string", enum: AccountStatus.allStr, required: false },
      },
      required: false,
    },
    gameData: { type: "number", required: false },
    creationTime: { type: "string", required: true },
    modificationTime: { type: "string", required: true },
  };

  constructor(json) {
    try {
      super(json, UserResponse.schema);
    } catch (e) {
      throw new ErrorInternalAPIModelValidation(e.message);
    }
    this.firstName = json.firstName;
    this.lastName = json.lastName;
    this.username = json.username;
    this.pronouns = json.pronouns;
    this.graduationYear = json.graduationYear;
    this.majors = json.majors;
    this.location = json.location;
    this.profileImage = json.profileImage;
    this.bannerImage = json.bannerImage;
    this.bio = json.bio;
    this.emails = json.emails;
    this.phone = json.phone;
    this.roles = json.roles;
    this.status = json.status;
    this.approvingUser = json.approvingUser;
    this.gameData = json.gameData;
    this.creationTime = json.creationTime;
    this.modificationTime = json.modificationTime;
  }
}

/**
 * Represents the http response body returned to a frontend with no private data.
 */
export class UserPublicResponse extends BaseModel {
  static schema = {
    firstName: { type: "string", required: true },
    lastName: { type: "string", required: true },
    username: { type: "string", required: true },
    pronouns: { type: ["string"], required: false },
    graduationYear: { type: "number", required: true },
    majors: { type: ["string"], required: false },
    location: { type: "string", required: false },
    profileImage: { type: "string", required: false },
    bannerImage: { type: "string", required: false },
    bio: { type: "string", required: true },
    roles: { type: ["string"], enum: Accounts.allStr, required: true },
    gameData: { type: "number", required: false },
    creationTime: { type: "string", required: true },
    modificationTime: { type: "string", required: true },
  };
  constructor(json) {
    try {
      super(json, UserPublicResponse.schema);
    } catch (e) {
      throw new ErrorInternalAPIModelValidation(e.message);
    }
    this.firstName = json.firstName;
    this.lastName = json.lastName;
    this.username = json.username;
    this.pronouns = json.pronouns;
    this.graduationYear = json.graduationYear;
    this.majors = json.majors;
    this.location = json.location;
    this.profileImage = json.profileImage;
    this.bannerImage = json.bannerImage;
    this.bio = json.bio;
    this.roles = json.roles;
    this.gameData = json.gameData;
    this.creationTime = json.creationTime;
    this.modificationTime = json.modificationTime;
  }
}

/**
 * Represents the http request body required to
 * update any number of a user's fields.
 */
export class UserUpdate extends BaseModelUpdate {
  static schema = {
    firstName: { type: "string", required: false },
    lastName: { type: "string", required: false },
    username: { type: "string", required: false },
    pronouns: { type: ["string"], required: false },
    graduationYear: { type: "number", required: false },
    majors: { type: ["string"], required: false },
    location: { type: "string", required: false },
    profileImage: { type: "string", required: false },
    bannerImage: { type: "string", required: false },
    bio: { type: "string", required: false },
    emails: { type: ["string"], required: false },
    phone: { type: "string", required: false },
    roles: { type: ["string"], enum: Accounts.allStr, required: false },
    status: { type: "string", enum: AccountStatus.allStr, required: false },
    approvingUser: { type: "string", required: false },
    gameData: { type: "number", required: false },
  };
  constructor(json) {
    try {
      super(json, UserUpdate.schema);
    } catch (e) {
      throw new ErrorInternalAPIModelValidation(e.message);
    }
    this.firstName = json.firstName;
    this.lastName = json.lastName;
    this.username = json.username;
    this.pronouns = json.pronouns;
    this.graduationYear = json.graduationYear;
    this.majors = json.majors;
    this.location = json.location;
    this.profileImage = json.profileImage;
    this.bannerImage = json.bannerImage;
    this.bio = json.bio;
    this.emails = json.emails;
    this.phone = json.phone;
    this.roles = json.roles;
    this.status = json.status;
    this.approvingUser = json.approvingUser;
    this.gameData = json.gameData;
    this.modificationTime = Date.now();
  }
}

/**
 * Represents the http request body required to delete a user.
 */
export class UserDelete extends BaseModel {
  static schema = {
    username: { type: "string", required: true },
  };

  constructor(json) {
    try {
      super(json, UserDelete.schema);
    } catch (e) {
      throw new ErrorInternalAPIModelValidation(e.message);
    }
    this.username = json.username;
  }
}
