import { Resend } from "resend";
import { ErrorPasswordReset, ErrorEmailSend } from "../error/errors";

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * EmailController Class
 *
 * This class controls the behaviour of any web request
 * related to Emails.
 */

export default class EmailController {
  /**
   * Sends an email to the designated information
   * @param {Request} req
   * @param {Response} res
   */
  static async sendEmail(req, res) {
    const { data, error } = await resend.emails.send({
      from: req.body.from,
      to: req.body.to,
      subject: req.body.subject,
      html: req.body.html,
    });

    if (error) {
      throw new ErrorEmailSend();
    }

    // res becomes id for email
    res.status(200).json({ data });
  }

  /**
   *
   * @param {Request} req
   * @param {Response} res
   * @returns the resetted email
   */
  static async resetPassword(req, res) {
    // get the corresponding email
    const { data, error } = await resend.emails.receiving.get(req.body.id);

    // verification
    if (html && req.body.type === "passwordReset") {
      // route to password reset
      return res.redirect("");
    } else {
      throw new ErrorPasswordReset();
    }
  }
}
