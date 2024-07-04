import Accounts from "../../app/models/enums/accounts.js";
import AccountStatus from "../../app/models/enums/account_status.js";

export const validUserLoginRaisa = {
  username: "raisa",
  password: "raisa",
};

export const validUserLoginEthan = {
  username: "ethan",
  password: "123",
};

export const invalidUserLoginEthan = {
  username: "ethan",
  password: "321",
};

export const invalidUserLoginRaisa = {
  username: "raisa",
  password: "notraisa",
};

export const pendingUserLoginAce = {
  username: "ace",
  password: "sparky",
};

export const validUserSignup = {
  firstName: "New",
  lastName: "User",
  username: "newuser",
  password: "newpassword",
  graduationYear: 2025,
  emails: ["newuser@example.com"],
  roles: [Accounts.Author.toString()],
  status: AccountStatus.Pending.toString(),
  creationTime: new Date("2024-01-01"),
  modificationTime: new Date("2024-01-01"),
};

export const existingUsernameSignup = {
  firstName: "Existing",
  lastName: "User",
  username: "raisa", // existing username
  password: "password",
  graduationYear: 2024,
  emails: ["existinguser@example.com"],
  roles: [Accounts.Editor.toString()],
  status: AccountStatus.Pending.toString(),
  creationTime: new Date("2024-01-01"),
  modificationTime: new Date("2024-01-01"),
};

export const existingEmailSignup = {
  firstName: "Existing",
  lastName: "User",
  username: "newusername",
  password: "password",
  graduationYear: 2024,
  emails: ["raisa@example.com"], // existing email
  roles: [Accounts.Editor.toString()],
  status: AccountStatus.Pending.toString(),
  creationTime: new Date("2024-01-01"),
  modificationTime: new Date("2024-01-01"),
};
