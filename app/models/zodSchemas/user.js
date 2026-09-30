import * as z from "zod";
import Accounts from "../enums/accounts.js";
import AccountStatus from "../enums/accountStatus.js";

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
  bio: z.string().optional(),
  password: z.string(),
  phone: z.string().optional(),
  // Defaults to "pending" (awaiting admin approval); invite signup passes "approved".
  // Default must be the string, not the enum object, or Mongoose's enum check rejects it.
  status: z.enum(AccountStatus.listr()).default(AccountStatus.Pending.toString()),
  // The inviting admin's user id, set on invite signup.
  approvingUser: z.string().optional(),
});

// Roles an admin may assign. "none" is excluded because it means no role at all.
const InviteRoles = Accounts.listr().filter((role) => role !== Accounts.None.toString());

export const UserInvite = z.object({
  to: z.array(z.email()).min(1),
  roles: z.array(z.enum(InviteRoles)).min(1),
});

// Email, roles, and status come from the invite. Zod strips unknown keys,
// so sending them in the body has no effect.
export const UserSignup = z.object({
  token: z.string().min(1),
  password: z.string().min(8),
  firstName: z.string(),
  lastName: z.string(),
  graduationYear: z.number(),
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
  approve: z.array(z.string()).optional(),
  deny: z.array(z.string()).optional(),
});

export const UserDelete = z.object({
  email: z.email(),
});

export const UserPrivateResponse = BaseUser.extend({
  id: z.literal("/user/response"),
  password: z.string(),
  phone: z.string().optional(),
  status: z.enum(AccountStatus.listr()),
  approvingUser: z.string().optional(),
});

export const UserPublicResponse = BaseUser.extend({
  id: z.literal("/user/public/response"),
});
