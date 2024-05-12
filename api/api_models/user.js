import { ErrorInternalAPIModelValidation } from "../error/internal_errors.js";
import AccountStatus from "../models/enums/account_status.js";
import Accounts from "../models/enums/accounts.js";
import { BaseModel, BaseModelUpdate, number, string, date, empty } from "./base_model.js";

/**
 * Represents the http request body required
 * to create a user in the database.
 */
export class UserCreate extends BaseModel {
  static schema = {
    firstName: { type: string, required: true },
    lastName: { type: string, required: true },
    username: { type: string, required: true },
    pronouns: { type: [string] },
    graduationYear: { type: number, required: true },
    majors: { type: [string] },
    location: { type: string },
    profileImage: { type: string },
    bannerImage: { type: string },
    bio: { type: string, required: true },
    emails: { type: [string], required: true },
    phone: { type: string },
    roles: { type: [string], enum: Accounts.allStr, required: true },
    status: { type: string, enum: AccountStatus.allStr, default: AccountStatus.Pending.status, override: true },
    approvingUser: { type: empty, default: undefined, override: true },
    gameData: { type: empty, default: undefined, override: true },
    creationTime: { type: date, default: Date.now(), override: true },
    modificationTime: { type: date, default: Date.now(), override: true },
  };

  constructor(json) {
    try {
      super(json, UserCreate.schema);
    } catch (e) {
      throw new ErrorInternalAPIModelValidation(e.message);
    }
  }
}

/**
 * Represents the http response body returned to a frontend.
 */
export class UserResponse extends BaseModel {
  static schema = {
    firstName: { type: string, required: true },
    lastName: { type: string, required: true },
    username: { type: string, required: true },
    pronouns: { type: [string], required: false },
    graduationYear: { type: number, required: true },
    majors: { type: [string] },
    location: { type: string },
    profileImage: { type: string },
    bannerImage: { type: string },
    bio: { type: string, required: true },
    emails: { type: [string], required: true },
    phone: { type: string },
    roles: { type: [string], enum: Accounts.allStr, required: true },
    status: { type: string, enum: AccountStatus.allStr, required: true },
    approvingUser: { type: UserPublicResponse.schema },
    gameData: { type: empty },
    creationTime: { type: date, required: true },
    modificationTime: { type: date, required: true },
  };

  constructor(json) {
    try {
      super(json, UserResponse.schema);
    } catch (e) {
      throw new ErrorInternalAPIModelValidation(e.message);
    }
  }
}

/**
 * Represents the http response body returned to a frontend with no private data.
 */
export class UserPublicResponse extends BaseModel {
  static schema = {
    firstName: { type: string, required: true },
    lastName: { type: string, required: true },
    username: { type: string, required: true },
    pronouns: { type: [string] },
    graduationYear: { type: number, required: true },
    majors: { type: [string] },
    location: { type: string },
    profileImage: { type: string },
    bannerImage: { type: string },
    bio: { type: string, required: true },
    roles: { type: [string], enum: Accounts.allStr, required: true },
    gameData: { type: empty },
    creationTime: { type: date, required: true },
    modificationTime: { type: date, required: true },
  };
  constructor(json) {
    try {
      super(json, UserPublicResponse.schema);
    } catch (e) {
      throw new ErrorInternalAPIModelValidation(e.message);
    }
  }
}

/**
 * Represents the http request body required to
 * update any number of a user's fields.
 */
export class UserUpdate extends BaseModelUpdate {
  static schema = {
    firstName: { type: string },
    lastName: { type: string },
    username: { type: string },
    pronouns: { type: [string] },
    graduationYear: { type: number },
    majors: { type: [string] },
    location: { type: string },
    profileImage: { type: string },
    bannerImage: { type: string },
    bio: { type: string },
    emails: { type: [string] },
    phone: { type: string },
    roles: { type: [string], enum: Accounts.allStr },
    status: { type: string, enum: AccountStatus.allStr },
    approvingUser: { type: string },
    gameData: { type: empty },
    modificationTime: { type: date, default: Date.now(), override: true },
  };

  constructor(json) {
    try {
      super(json, UserUpdate.schema);
    } catch (e) {
      throw new ErrorInternalAPIModelValidation(e.message);
    }
  }
}

/**
 * Represents the http request body required to delete a user.
 */
export class UserDelete extends BaseModel {
  static schema = {
    username: { type: string, required: true },
  };

  constructor(json) {
    try {
      super(json, UserDelete.schema);
    } catch (e) {
      throw new ErrorInternalAPIModelValidation(e.message);
    }
  }
}
