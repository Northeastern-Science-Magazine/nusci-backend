import AccountStatus from "../enums/accountStatus.js";
import Accounts from "../enums/accounts.js";
import { string, date, array, integer, object } from "./schemaTypes.js";

/**
 * INTERNAL USE ONLY
 *
 * Base model that contains fields commonly used to describe a user.
 */
const commonUserProperties = {
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
  roles: { type: array, items: { enum: Accounts.listr(), required: true } },
  gameData: { const: undefined },
  creationTime: { type: date, required: true },
  modificationTime: { type: date, required: true },
};

/* private user response; the base model with additional properties */
export const userResponse = {
  type: object,
  id: "/user/response",
  properties: {
    ...commonUserProperties,
    password: { type: string, required: true },
    phone: { type: string },
    status: { enum: AccountStatus.listr(), required: true },
    approvingUser: { const: undefined },
  },
};

/* public user response; just the publicaly accesible data from the base */
export const userPublicResponse = {
  type: object,
  id: "/user/public/response",
  properties: {
    ...commonUserProperties,
  },
};
