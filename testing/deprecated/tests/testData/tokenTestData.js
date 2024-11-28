import jwt from "jsonwebtoken";
import { config as dotenvConfig } from "dotenv";
import Accounts from "../../app/models/enums/accounts.js";

dotenvConfig();

if (!process.env.SERVER_TOKEN_KEY) {
  throw new Error("SERVER_TOKEN_KEY is not defined in the environment variables");
}

const generateToken = (email, roles) => {
  if (!Array.isArray(roles)) {
    roles = [roles];
  }

  return jwt.sign(
    {
      email: email,
      roles: roles,
    },
    process.env.SERVER_TOKEN_KEY,
    { expiresIn: process.env.TOKEN_EXPIRY || "1h" }
  );
};

// User data (email) with roles
const users = [
  { email: "ethan@ethan.com", roles: Accounts.Admin.role },
  { email: "raisa@raisa.com", roles: Accounts.Admin.role },
  { email: "sutton@sutton.com", roles: Accounts.Developer.role },
  { email: "arushi@arushi.com", roles: Accounts.Developer.role },
  { email: "jiajia@jiajia.com", roles: Accounts.Photographer.role },
  { email: "noah@noah.com", roles: Accounts.Editor.role },
  { email: "nethra@nethra.com", roles: Accounts.Editor.role },
  { email: "vianna@vianna.com", roles: Accounts.Designer.role },
  { email: "jasmine@jasmine.com", roles: Accounts.Author.role },
  { email: "johnnyappleseed@johnnyappleseed.com", roles: Accounts.Developer.role },
  { email: "janedoe@janedoe.com", roles: Accounts.Photographer.role },
  { email: "kayla@kayla.com", roles: Accounts.Admin.role },
  { email: "anika@anika.com", roles: Accounts.Author.role },
  { email: "ace@ace.com", roles: Accounts.Editor.role },
];

// Generate tokens for each user
const tokens = {};
users.forEach((user) => {
  tokens[user.email] = generateToken(user.email, user.roles);
});

export default tokens;

/*
To use, import tokens into testFile, then after get/post add 
      .set("Cookie", [`token=${tokens.[email]}`])

For example (admin privileges):
const response = await request(app)
      .get("/admin/only/route")
      .set("Cookie", [`token=${tokens.ethan}`]);
*/
