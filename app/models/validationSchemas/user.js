import AccountStatus from "../enums/accountStatus.js";
import Accounts from "../enums/accounts.js";
import { string, date, array, integer, object } from "./schemaTypes.js";

/**
 * INTERNAL USE ONLY
 *
 * Base model that contains fields commonly used to describe a user.
 */
const userProps = {
  firstName: { type: string, required: true },
  lastName: { type: string, required: true },
  pronouns: { type: array, items: { type: string } },
  graduationYear: { type: integer, required: true },
  major: { type: string },
  location: { type: string },
  profileImage: { type: string },
  bannerImage: { type: string },
  bio: { type: string, required: true },
  email: { type: string, required: true },
  roles: { type: array, items: { type: string, enum: Accounts.listr(), required: true } },
  gameData: { const: undefined },
  creationTime: { type: date, required: true },
  modificationTime: { type: date, required: true },
};

/**
 * User Response containing all user properties.
 */
export const userResponse = {
  type: object,
  id: "/user/response",
  properties: {
    ...userProps,
    password: { type: string, required: true },
    phone: { type: string },
    status: { enum: AccountStatus.listr(), required: true },
    approvingUser: { const: undefined },
  },
};

/**
 * User Public Response containing all publicly available user data.
 */
export const userPublicResponse = {
  type: object,
  id: "/user/public/response",
  properties: {
    ...userProps,
  },
};
