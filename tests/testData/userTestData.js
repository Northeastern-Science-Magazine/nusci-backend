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
  bio: "New user bio",
  emails: ["newuser@example.com"],
  roles: [Accounts.Author.toString()],
  status: AccountStatus.Pending.toString(),
};

export const existingUsernameSignup = {
  firstName: "Existing",
  lastName: "User",
  username: "raisa", // existing username
  password: "password",
  graduationYear: 2024,
  bio: "Existing user bio",
  emails: ["existinguser@example.com"],
  roles: [Accounts.Editor.toString()],
  status: AccountStatus.Pending.toString(),
};

export const existingEmailSignup = {
  firstName: "Existing",
  lastName: "Email",
  username: "newusername",
  password: "password",
  graduationYear: 2024,
  bio: "Existing user bio",
  emails: ["raisa@example.com"], // existing email
  roles: [Accounts.Editor.toString()],
  status: AccountStatus.Pending.toString(),
};
