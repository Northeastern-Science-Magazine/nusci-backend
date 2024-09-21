import AccountStatus from "../enums/accountStatus.js";
import Accounts from "../enums/accounts.js";
import { BaseModel, BaseModelUpdate, number, string, date, empty, now } from "./baseModel.js";

/**
 * Represents the http request body required
 * to create a user in the database.
 */
export class UserCreate extends BaseModel {
  static schema = {
    firstName: { type: string, required: true },
    lastName: { type: string, required: true },
    username: { type: string, required: true },
    password: { type: string, required: true },
    pronouns: { type: [string] },
    graduationYear: { type: number, required: true },
    major: { type: string },
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
    creationTime: { type: date, default: now, override: true },
    modificationTime: { type: date, default: now, override: true },
  };

  constructor(json) {
    super(json, UserCreate.schema);
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
    major: { type: string },
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
    super(json, UserPublicResponse.schema);
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
    password: { type: string, required: true },
    pronouns: { type: [string], required: false },
    graduationYear: { type: number, required: true },
    major: { type: string },
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
    super(json, UserResponse.schema);
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
    major: { type: string },
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
    modificationTime: { type: date, default: now, override: true },
  };

  constructor(json) {
    super(json, UserUpdate.schema);
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
    super(json, UserDelete.schema);
  }
}
