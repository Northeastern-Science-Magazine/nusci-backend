import EmailAccessor from "../databaseAccessors/emailAccessor.js";
import { CustomEmail, DeadlineEmail, ReminderEmail, ResetPasswordEmail, OTPEmail } from "../models/zodSchemas/email.js";
import { GenerateEmail, ResendEmail } from "../services/email/emailService.js";
import EmailType from "../models/enums/emailType.js";
import { ErrorUnexpected, ErrorValidation, HttpError } from "../error/errors.js";

export default class EmailController {
  /**
   * Sends an email to a single or multiple users.
   * @param {Request} req
   * @param {Response} res
   */
  static async sendEmail(req, res) {
    try {
      // Validate incoming
      const parsedEmail = EmailController.validateEmailRequestData(req.body);

      // Format email according to its type
      const email = await EmailController.generateEmailVariables(parsedEmail);

      // insert record into db
      await EmailAccessor.createEmail(email);

      // send email using Resend API
      const response = await ResendEmail.sendEmailWithTemplate(email);
      res.status(200).json(response);
    } catch (e) {
      if (e instanceof HttpError) {
        e.throwHttp(req, res);
      } else {
        new ErrorUnexpected(e.message).throwHttp(req, res);
      }
    }
  }

  /**
   * Helper method to validate incoming requests against their corresponding email type
   * and create the object to send through the Resend API.
   * @param {Object} emailObj the email object (from request body).
   * @returns {Object} the formatted email object
   */
  static validateEmailRequestData = (emailObj) => {
    const types = EmailType.listr();
    const template = types.find((type) => type === emailObj.type);
    if (!template) {
      throw new ErrorUnexpected(`Email template ${emailObj.type} not found.`);
    }

    let templateSchema;

    switch (EmailType.toEmailType(template)) {
      case EmailType.Custom:
        templateSchema = CustomEmail;
        break;
      case EmailType.Deadline:
        templateSchema = DeadlineEmail;
        break;
      case EmailType.Invite_User:
        // Invites need roles and one token per recipient, which only /user/invite handles.
        throw new ErrorValidation("Use POST /user/invite to send invites.");
      case EmailType.Reminder:
        templateSchema = ReminderEmail;
        break;
      case EmailType.Reset_Password:
        templateSchema = ResetPasswordEmail;
        break;
      case EmailType.OTP:
        templateSchema = OTPEmail;
        break;
    }

    const parsedEmail = templateSchema.safeParse(emailObj);
    if (!parsedEmail.success) {
      throw new ErrorValidation("Email schema validation failed.");
    }

    return parsedEmail.data;
  };

  static async generateEmailVariables(email) {
    let generatedEmailData;

    switch (EmailType.toEmailType(email.type)) {
      case EmailType.Custom:
        generatedEmailData = GenerateEmail.Custom(email);
        break;
      case EmailType.Deadline:
        generatedEmailData = GenerateEmail.Deadline(email);
        break;
      case EmailType.Reminder:
        generatedEmailData = GenerateEmail.Reminder(email);
        break;
      case EmailType.Reset_Password:
        generatedEmailData = GenerateEmail.ResetPassword(email);
        break;
      case EmailType.OTP:
        generatedEmailData = await GenerateEmail.OTP(email);
        break;
    }
    return generatedEmailData;
  }
}
