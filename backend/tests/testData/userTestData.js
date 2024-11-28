import Accounts from "../../app/models/enums/accounts.js";
import AccountStatus from "../../app/models/enums/accountStatus.js";

export const validUserLoginRaisa = {
  email: "raisa@raisa.com",
  password: "raisa",
};

export const validUserLoginEthan = {
  email: "ethan@ethan.com",
  password: "123",
};

export const invalidUserLoginEthan = {
  email: "ethan@ethan.com",
  password: "321",
};

export const invalidUserLoginRaisa = {
  email: "raisa@raisa.com",
  password: "notraisa",
};

export const pendingUserLoginAce = {
  email: "ace@ace.com",
  password: "sparky",
};

export const validEmailSignup = {
  firstName: "New",
  lastName: "User",
  password: "newpassword",
  graduationYear: 2025,
  bio: "New user bio",
  email: "newuser@example.com",
  roles: [Accounts.Author.toString()],
  status: AccountStatus.Pending.toString(),
};

export const existingEmailSignup = {
  firstName: "Existing",
  lastName: "Email",
  password: "password",
  graduationYear: 2024,
  bio: "Existing user bio",
  email: "raisa@raisa.com", // existing email
  roles: [Accounts.Editor.toString()],
  status: AccountStatus.Pending.toString(),
};

export const validEmailQueryRaisa = {
  firstName: "Raisa",
  lastName: "B",
  pronouns: [],
  graduationYear: 2025,
  major: "Computer Science and Mathematics",
  location: "New York",
  profileImage: "https://example.com/profile.jpg",
  bannerImage: "https://example.com/banner.jpg",
  bio: "Co-Head of Web & Software with Ethan",
  email: "raisa@raisa.com",
  roles: ["admin"],
  creationTime: "2024-02-27T00:00:00.000Z",
  modificationTime: "2024-02-27T00:00:00.000Z",
};

export const validEmailQueryEthan = {
  firstName: "Ethan",
  lastName: "S",
  pronouns: [],
  graduationYear: 2026,
  major: "Computer Science and Mathematics",
  location: "New Jersey",
  profileImage: "https://example.com/profile.jpg",
  bannerImage: "https://example.com/banner.jpg",
  bio: "Co-Head of Web & Software with Raisa",
  email: "ethan@ethan.com",
  roles: ["admin"],
  creationTime: "2024-02-27T00:00:00.000Z",
  modificationTime: "2024-02-27T00:00:00.000Z",
};
