// Raw OTP tokens seeded by setup/seed/otp_seed.js (the database stores only their hashes).
const otpTokens = {
  validInvite: "valid-invite-token", // newuser@northeastern.edu, author
  usedInvite: "used-invite-token", // used@northeastern.edu
  expiredInvite: "expired-invite-token", // expired@northeastern.edu
  existingUserInvite: "existing-user-invite-token", // raisa@raisa.com (already has an account)
  validLogin: "valid-login-token", // ethan@ethan.com
  expiredLogin: "expired-login-token", // ethan@ethan.com
};

export default otpTokens;

/*
To use, import otpTokens into testFile, then send the raw token:
      .query({ token: otpTokens.validInvite })
*/
