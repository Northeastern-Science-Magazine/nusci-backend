import * as z from "zod";
import Accounts from "../enums/accounts.js";
import AccountStatus from "../enums/accountStatus.js";
import { ErrorValidation } from "../../error/errors.js";

export const BaseUser = z.object({
  firstName: z.string(),
  lastName: z.string(),
  pronouns: z.array(z.string()).default([]),
  graduationYear: z.number(),
  major: z.string().optional(),
  location: z.string().optional(),
  profileImage: z.string().optional(),
  bannerImage: z.string().optional(),
  bio: z.string(),
  email: z.email(),
  roles: z.string().array(Accounts.listr()),
  gameData: z.undefined().optional(),
  creationTime: z.date(),
  modificationTime: z.date(),
});

export const Login = z.object({
  email: z.email(),
  password: z.string(),
});

export const UserCreate = BaseUser.extend({
  password: z.string(),
  phone: z.string().optional(),
  status: z.string(AccountStatus.listr()).default(AccountStatus.Pending),
  approvinguser: z.undefined().optional(),
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

// approve and deny are supposed to be arrays of emails according to resolveUserApprovals docs, but tests only have usernames, so email-parsing is omitted
export const UserApprovals = z.object({
  approve: z.array(z.string()).optional(),
  deny: z.array(z.string()).optional(),
});

export const UserDelete = z.object({
  email: z.email(),
});

export const UserPrivateResponse = z.object({
  id: z.literal("/user/response"),
  properties: BaseUser.extend({
    password: z.string(),
    phone: z.string().optional,
    status: z.enum(AccountStatus.listr()),
    approvingUser: z.undefined().optional(),
  }),
});

export const UserPublicResponse = BaseUser.extend({
  id: z.literal("/user/public/response"),
});
