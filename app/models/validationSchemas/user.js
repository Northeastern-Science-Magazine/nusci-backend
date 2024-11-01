import AccountStatus from "../enums/accountStatus.js";
import Accounts from "../enums/accounts.js";
import { string, date, array, integer, object } from "./schemaTypes.js";

export const userResponse = {
  id: "/user/response",
  type: object,
  properties: {
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
    emails: { type: array, items: { type: string }, required: true },
    phone: { type: string },
    roles: { type: array, items: { enum: Accounts.listr(), required: true } },
    status: { enum: AccountStatus.listr(), required: true },
    approvingUser: { const: undefined },
    gameData: { const: undefined },
    creationTime: { type: date, required: true },
    modificationTime: { type: date, required: true },
  },
};

export const userPublicResponse = {
  id: "/user/public/response",
  type: object,
  properties: {
    firstName: { type: string, required: true },
    lastName: { type: string, required: true },
    pronouns: { type: array, items: { type: string } },
    graduationYear: { type: integer, required: true },
    major: { type: string },
    location: { type: string },
    profileImage: { type: string },
    bannerImage: { type: string },
    bio: { type: string, required: true },
    roles: { type: array, items: { enum: Accounts.listr(), required: true } },
    status: { enum: AccountStatus.listr(), required: true },
    gameData: { const: undefined },
    creationTime: { type: date, required: true },
    modificationTime: { type: date, required: true },
  },
};
