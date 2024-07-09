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

export const validUsernameQueryRaisa = {
  firstName: "Raisa",
  lastName: "B",
  username: "raisa",
  pronouns: [],
  graduationYear: 2025,
  majors: ["Computer Science", "Mathematics"],
  location: "New York",
  profileImage: "https://example.com/profile.jpg",
  bannerImage: "https://example.com/banner.jpg",
  bio: "Co-Head of Web & Software with Ethan",
  roles: ["admin"],
  creationTime: "2024-02-27T00:00:00.000Z",
  modificationTime: "2024-02-27T00:00:00.000Z",
};

export const validUsernameQueryEthan = {
  firstName: "Ethan",
  lastName: "S",
  username: "ethan",
  pronouns: [],
  graduationYear: 2026,
  majors: ["Computer Science", "Mathematics"],
  location: "New Jersey",
  profileImage: "https://example.com/profile.jpg",
  bannerImage: "https://example.com/banner.jpg",
  bio: "Co-Head of Web & Software with Raisa",
  roles: ["admin"],
  creationTime: "2024-02-27T00:00:00.000Z",
  modificationTime: "2024-02-27T00:00:00.000Z",
};
