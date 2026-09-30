import { Resend } from "resend";
import { ErrorUnexpected } from "../../error/errors.js";
import OTPToken from "../../auth/opt.js";
import OTPAccessor from "../../databaseAccessors/otpAccessor.js";
import EmailType from "../../models/enums/emailType.js";

// all emails should come from this domain. You guys can change it later if you want.
const FROM = "NU Sci Magazine <noreply@nuscimagazine.com>";

// Invites last 7 days; login links keep the 15-minute default.
const INVITE_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000;

/**
 * Returns an email in the following format:

    to: String[]
    from: String
    type: EmailType
    variables: Object

 * Each function is a set of specific instructions to
 * generate that email object.
 */
export class GenerateEmail {
  static Custom(customEmail) {}

  static Deadline(deadlineEmail) {}

  /**
   * InviteUser Method
   *
   * This method creates a single-use signup invite for one
   * recipient and returns the email to send.
   *
   * @param {Object} inviteUserEmail { to: [email], roles, invitedBy }
   * @returns {Object} email object { from, to, type, variables }
   */
  static async InviteUser(inviteUserEmail) {
    const { to, roles, invitedBy } = inviteUserEmail;
    // One recipient per call so each person gets their own token (OTP shares one token across `to`).
    if (to.length !== 1) {
      throw new ErrorUnexpected("InviteUser takes exactly one recipient.");
    }

    const { token, hash } = OTPToken.generate();
    await OTPAccessor.createOTPRecord(to[0], hash, {
      purpose: "invite",
      roles: roles,
      invitedBy: invitedBy,
      expiresAt: new Date(Date.now() + INVITE_EXPIRY_MS),
    });

    return {
      from: FROM,
      to: to,
      type: EmailType.Invite_User.toString(),
      variables: {
        url: `${process.env.FRONTEND_URL}/signup?token=${token}`,
      },
    };
  }

  static Reminder(reminderEmail) {}

  static ResetPassword(resetPasswordEmail) {}

  static async OTP(otpEmail) {
    const { token, hash } = OTPToken.generate();
    await OTPAccessor.createOTPRecord(otpEmail.to[0], hash);
    return {
      from: FROM,
      to: otpEmail.to,
      type: otpEmail.type,
      variables: {
        url: `${process.env.FRONTEND_URL}/otp/verify?token=${token}`,
      },
    };
  }
}

export class ResendEmail {
  static async sendEmailWithTemplate(email) {
    try {
      const { from, to, type, variables } = email;
      const resend = new Resend(process.env.RESEND_API_KEY);

      const { data, error } = await resend.emails.send({
        from: from,
        to: to,
        template: {
          id: type,
          variables: variables,
        },
      });

      if (error) {
        throw new ErrorUnexpected("Email send failed.");
      }

      return data;
    } catch (e) {
      throw new ErrorUnexpected("Email send not reached.");
    }
  }
}
