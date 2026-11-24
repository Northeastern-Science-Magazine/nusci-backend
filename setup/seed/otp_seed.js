import OTPToken from "../../app/auth/opt.js";
import Accounts from "../../app/models/enums/accounts.js";
import otpTokens from "../../tests/testData/otpTestData.js";

const FUTURE = new Date("2099-01-01");
const PAST = new Date("2000-01-01");

// Tokens are hashed here because the database only ever stores the hash.
const otp_seed = [
  {
    email: "newuser@northeastern.edu",
    token: OTPToken.hash(otpTokens.validInvite),
    purpose: "invite",
    roles: [Accounts.Author.toString()],
    expiresAt: FUTURE,
  },
  {
    email: "used@northeastern.edu",
    token: OTPToken.hash(otpTokens.usedInvite),
    purpose: "invite",
    roles: [Accounts.Author.toString()],
    expiresAt: FUTURE,
    used: true,
  },
  {
    email: "expired@northeastern.edu",
    token: OTPToken.hash(otpTokens.expiredInvite),
    purpose: "invite",
    roles: [Accounts.Author.toString()],
    expiresAt: PAST,
  },
  {
    email: "raisa@raisa.com",
    token: OTPToken.hash(otpTokens.existingUserInvite),
    purpose: "invite",
    roles: [Accounts.Editor.toString()],
    expiresAt: FUTURE,
  },
  {
    email: "ethan@ethan.com",
    token: OTPToken.hash(otpTokens.validLogin),
    purpose: "login",
    expiresAt: FUTURE,
  },
  {
    email: "ethan@ethan.com",
    token: OTPToken.hash(otpTokens.expiredLogin),
    purpose: "login",
    expiresAt: PAST,
  },
];

export default otp_seed;
