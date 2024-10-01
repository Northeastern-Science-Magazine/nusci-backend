import jwt from "jsonwebtoken";
import { config as dotenvConfig } from "dotenv";
import Accounts from "../../app/models/enums/accounts.js";

dotenvConfig();

if (!process.env.SERVER_TOKEN_KEY) {
  throw new Error("SERVER_TOKEN_KEY is not defined in the environment variables");
}

const generateToken = (emails, roles) => {
  if (!Array.isArray(roles)) {
    roles = [roles];
  }

  return jwt.sign(
    {
      emails: emails,
      roles: roles,
    },
    process.env.SERVER_TOKEN_KEY,
    { expiresIn: process.env.TOKEN_EXPIRY || "1h" }
  );
};

// User data (emailss) with roles
const users = [
  { emails: "ethan@ethan.com", roles: Accounts.Admin.role },
  { emails: "raisa@raisa.com", roles: Accounts.Admin.role },
  { emails: "sutton@sutton.com", roles: Accounts.Developer.role },
  { emails: "arushi@arushi.com", roles: Accounts.Developer.role },
  { emails: "jiajia@jiajia.com", roles: Accounts.Photographer.role },
  { emails: "noah@noah.com", roles: Accounts.Editor.role },
  { emails: "nethra@nethra.com", roles: Accounts.Editor.role },
  { emails: "vianna@vianna.com", roles: Accounts.Designer.role },
  { emails: "jasmine@jasmine.com", roles: Accounts.Author.role },
  { emails: "johnnyappleseed@johnnyappleseed.com", roles: Accounts.Developer.role },
  { emails: "janedoe@janedoe.com", roles: Accounts.Photographer.role },
  { emails: "kayla@kayla.com", roles: Accounts.Admin.role },
  { emails: "anika@anika.com", roles: Accounts.Author.role },
  { emails: "ace@ace.com", roles: Accounts.Editor.role },
];

// Generate tokens for each user
const tokens = {};
users.forEach((user) => {
  const emailKey = user.emails.replace('@', '').replace('.com', '');
  tokens[emailKey] = generateToken(user.emails, user.roles);
});

export default tokens;

/*
To use, import tokens into testFile, then after get/post add 
      .set("Cookie", [`token=${tokens.[emails]}`])

For example (admin privileges):
const response = await request(app)
      .get("/admin/only/route")
      .set("Cookie", [`token=${tokens.ethan}`]);
*/
