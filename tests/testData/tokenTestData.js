import jwt from "jsonwebtoken";
import { config as dotenvConfig } from "dotenv";
import Accounts from "../../app/models/enums/accounts.js";

dotenvConfig();

// Validate environment variables
if (!process.env.SERVER_TOKEN_KEY) {
  throw new Error("SERVER_TOKEN_KEY is not defined in the environment variables");
}

// Ensure roles is an array
const generateToken = (username, roles) => {
  if (!Array.isArray(roles)) {
    roles = [roles];
  }

  return jwt.sign(
    {
      username: username,
      roles: roles,
    },
    process.env.SERVER_TOKEN_KEY,
    { expiresIn: process.env.TOKEN_EXPIRY || "1h" }
  );
};

// User information with their roles
const users = [
  { username: "ethan", roles: Accounts.Admin.role },
  { username: "raisa", roles: Accounts.Admin.role },
  { username: "sutton", roles: Accounts.Developer.role },
  { username: "arushi", roles: Accounts.Developer.role },
  { username: "jiajia", roles: Accounts.Photographer.role },
  { username: "noah", roles: Accounts.Editor.role },
  { username: "nethra", roles: Accounts.Editor.role },
  { username: "vianna", roles: Accounts.Designer.role },
  { username: "jasmine", roles: Accounts.Author.role },
  { username: "johnnyappleseed", roles: Accounts.Developer.role },
  { username: "janedoe", roles: Accounts.Photographer.role },
  { username: "kayla", roles: Accounts.Admin.role },
  { username: "anika", roles: Accounts.Author.role },
  { username: "ace", roles: Accounts.Editor.role },
];

// Generate tokens for each user
const tokens = {};
users.forEach((user) => {
  tokens[user.username] = generateToken(user.username, user.roles);
});

export default tokens;

/*
To use, import tokens into testFile, then after get/post add 
      .set("Cookie", [`token=${tokens.[username]}`])

For example (admin privileges):
const response = await request(app)
      .get("/admin/only/route")
      .set("Cookie", [`token=${tokens.ethan}`]);
*/
