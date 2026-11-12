import { Resend } from "resend";
import { ErrorUnexpected } from "../../error/errors.js";
import OTPToken from "../../auth/opt.js";
import OTPAccessor from "../../databaseAccessors/otpAccessor.js";
import EmailType from "../../models/enums/emailType.js";

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

  static Reminder(reminderEmail) {
    return {
      from: "NU Sci Magazine <sign-up@no-reply.nuscimagazine.com>",
      to: reminderEmail.to,
      type: reminderEmail.type,
      variables: {
        reminderTitle: reminderEmail.reminderTitle,
        reminderDate: reminderEmail.reminderDate,
      },
    };
  }

  static ResetPassword(resetPasswordEmail) {}

  static async OTP(otpEmail) {
    const { token, hash } = OTPToken.generate();
    await OTPAccessor.createOTPRecord(otpEmail.to[0], hash);
    console.log(`${process.env.FRONTEND_URL}/otp/verify?token=${token}`);
    return {
      from: "NU Sci Magazine <sign-up@no-reply.nuscimagazine.com>",
      to: otpEmail.to,
      type: otpEmail.type,
      variables: {
        url: `${process.env.FRONTEND_URL}/otp/verify?token=${token}`,
      },
    };
  }

  static ArticlePitch(pitch, recipients) {
    return {
      from: "NU Sci Magazine <pitch@no-reply.nuscimagazine.com>",
      to: recipients,
      type: EmailType.Article_Pitch.toString(),
      variables: {
        name: pitch.name,
        email: pitch.email,
        topic: pitch.topic,
        draftUrl: pitch.draftUrl || "No draft provided.",
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
        console.error("Resend email send failed:", error);
        throw new ErrorUnexpected("Email send failed.");
      }

      return data;
    } catch (e) {
      if (e instanceof ErrorUnexpected) throw e;
      console.log(e);
      throw new ErrorUnexpected("Email send not reached.");
    }
  }
}
