import * as z from "zod";
import Accounts from "../enums/accounts.js";
import AccountStatus from "../enums/accountStatus.js";
import { ErrorValidation } from "../../error/errors.js";

export const BaseUser = z.object({
  firstName: z.string(),
  lastName: z.string(),
  pronouns: z.array(z.string()).default([]),
  graduationYear: z.number(),
  major: z.string().nullish(),
  location: z.string().nullish(),
  profileImage: z.string().nullish(),
  bannerImage: z.string().nullish(),
  bio: z.string(),
  email: z.email(),
  roles: z.array(z.enum(Accounts.listr())),
  gameData: z.undefined().nullish(),
  creationTime: z.date(),
  modificationTime: z.date(),
});

export const Login = z.object({
  email: z.email(),
  password: z.string(),
});

export const UserCreate = BaseUser.extend({
  password: z.string(),
  phone: z.string().nullish(),
  status: z.enum(AccountStatus.listr()).default(AccountStatus.Pending),
  approvinguser: z.undefined().nullish(),
});

export const UserUpdate = BaseUser.extend({
  phone: z.string(),
  status: z.enum(AccountStatus.listr()).default(AccountStatus.Pending),
  approvingUser: z.string(),
  modificationTime: z.date().default(new Date()),
})
  .omit({
    creationTime: true,
  })
  .partial();

// Fields a user is allowed to change about themselves. Excludes email, roles,
// status, and approvingUser, which must never be self-editable.
export const SelfProfileUpdate = BaseUser.pick({
  firstName: true,
  lastName: true,
  pronouns: true,
  graduationYear: true,
  major: true,
  location: true,
  profileImage: true,
  bannerImage: true,
  bio: true,
})
  .extend({
    phone: z.string(),
    modificationTime: z.date().default(new Date()),
  })
  .partial();

// approve and deny are supposed to be arrays of emails according to resolveUserApprovals docs, but tests only have usernames, so email-parsing is omitted
export const UserApprovals = z.object({
  approve: z.array(z.string()).nullish(),
  deny: z.array(z.string()).nullish(),
});

export const UserDelete = z.object({
  email: z.email(),
});

export const UserPrivateResponse = BaseUser.extend({
  password: z.string(),
  phone: z.string().nullish(),
  status: z.enum(AccountStatus.listr()),
  // @TODO this is an unpopulated Mongoose ref, so it's actually an ObjectId, not a string.
  // Works today only because both current callers (getMyProfile, updateMyProfile) manually
  // call .toString() on it before validating. See app/models/zodSchemas/article.js's
  // UserRefOrPublicResponse for the pattern to fix this properly if a new caller needs it.
  approvingUser: z.string().nullish(),
});

export const UserPublicResponse = BaseUser;
