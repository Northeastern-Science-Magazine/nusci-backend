import EmailAccessor from "../databaseAccessors/emailAccessor.js";
import {
  CustomEmail,
  DeadlineEmail,
  InviteUserEmail,
  ReminderEmail,
  ResetPasswordEmail,
  OTPEmail,
} from "../models/zodSchemas/email.js";
import { GenerateEmail, ResendEmail } from "../services/email/emailService.js";
import EmailType from "../models/enums/emailType.js";

export default class EmailController {
  /**
   * Sends an email to a single or multiple users.
   * @param {Request} req
   * @param {Response} res
   */
  static async sendEmail(req, res) {
    // Validate incoming
    const parsedEmail = EmailController.validateEmailRequestData(req.body);

    // Format email according to its type
    const email = EmailController.generateEmailVariables(parsedEmail);

    // insert record into db
    await EmailAccessor.createEmail(email);

    // send email using Resend API
    const response = await ResendEmail.sendEmail(email);
    res.json(response);
    res.status(200);
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
      throw new ErrorUnexpected(`Email template ${emailObj.template} not found.`);
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
        templateSchema = InviteUserEmail;
        break;
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

    return parsedEmail;
  };

  static generateEmailVariables(email) {
    let generatedEmailData;

    switch (EmailType.toEmailType(email.type)) {
      case EmailType.Custom:
        generatedEmailData = GenerateEmail.Custom(email);
        break;
      case EmailType.Deadline:
        generatedEmailData = GenerateEmail.Deadline(email);
        break;
      case EmailType.Invite_User:
        generatedEmailData = GenerateEmail.InviteUser(email);
        break;
      case EmailType.Reminder:
        generatedEmailData = GenerateEmail.Reminder(email);
        break;
      case EmailType.Reset_Password:
        generatedEmailData = GenerateEmail.ResetPassword(email);
        break;
      case EmailType.OTP:
        generatedEmailData = GenerateEmail.OTP(email);
        break;
    }
    return generatedEmailData;
  }
}
