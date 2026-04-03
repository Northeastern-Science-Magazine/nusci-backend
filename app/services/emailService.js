import { Resend } from "resend";
import { ErrorUnexpected, ErrorValidation } from "../error/errors";
import EmailType from "../models/enums/emailType";
import {
  BaseEmail,
  CustomEmail,
  DeadlineEmail,
  InviteUserEmail,
  ReminderEmail,
  ResetPasswordEmail,
} from "../models/zodSchemas/email";

export default class EmailService {
  /**
   * Helper method to validate incoming requests against their corresponding email type
   * and create the object to send through the Resend API.
   * @param {Object} emailObj the email object (from request body).
   * @returns {Object} the formatted email object
   */
  static formatEmail = (emailObj) => {
    const retrievedTemplate = EmailType.listr().find((type) => type.toString() === template);
    let templateSchema;

    // is there an easier way to do this? template (str) -> Zod Schema
    switch (retrievedTemplate) {
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
    }

    const parsedEmail = templateSchema.safeParse(email);
    if (!parsedEmail.success) {
      throw new ErrorValidation("Email schema validation failed.");
    }
    // any fields not within baseEmail form part of variables
    const baseEmailKeys = BaseEmail.keyof().options;

    const emailVariables = Object.keys(parsedEmail.data) // get keys of parsed email object
      .filter((key) => !baseEmailKeys.includes(key)) // filter the baseEmail keys from our parsed email object to get the template-unique vars
      .reduce((obj, key) => {
        obj[key] = parsedEmail.data[key]; // then, create the variables object with the filtered keys
        return obj;
      }, {});

    const email = {
      to: parsedEmaill.data.to,
      from: parsedEmail.data.from,
      type: retrievedTemplate,
      subject: parsedEmail.data.subject,
      variables: emailVariables,
    };

    return email;
  };

  /**
   * Sends an email to a single or multiple users.
   * @param {Request} req
   * @param {Response} res
   */
  static async sendEmail(req, res) {
    // parse incoming request body
    const formattedEmail = this.formatEmail(req.body);

    // formatted email should contain users, id, variables
    const response = await this.sendEmailHelper(formattedEmail);
    res.json(response);
    res.status(200);
  }

  /**
   * Helper to carry email-sending logic.
   * @param {*} emailObj the formatted email object, which should already be validated.
   */
  static async sendEmailHelper(emailObj) {
    const { to, type, subject, variables } = emailObj;
    const resend = new Resend(process.env.RESEND_API_KEY);

    const settled = await Promise.allSettled(
      to.map(
        async (emailTo) =>
          await resend.emails.send({
            from: emailObj.from,
            to: emailTo,
            subject: subject,
            template: {
              id: type,
              variables: variables,
            },
          })
      )
    );

    // handle logic here, prob metrics for emails successfully/failed sent
    if (!settled) {
      throw new ErrorUnexpected("Email send failed.");
    }
  }
}
