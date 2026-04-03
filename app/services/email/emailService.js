import { Resend } from "resend";
import { ErrorUnexpected } from "../../error/errors.js";

// all emails should come from this domain. You guys can change it later if you want.
const FROM = "NU Sci Magazine <noreply@nuscimagazine.com>";

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

  static InviteUser(inviteUserEmail) {}

  static Reminder(reminderEmail) {}

  static ResetPassword(resetPasswordEmail) {}

  static OTP(otpEmail) {
    return {
      from: otpEmail.from,
      to: otpEmail.to,
      type: otpEmail.type,
      variables: {},
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
      console.log(e);
      throw new ErrorUnexpected("Email send not reached.");
    }
  }
}
