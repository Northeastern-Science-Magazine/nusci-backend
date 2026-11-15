import PitchAccessor from "../databaseAccessors/pitchAccessor.js";
import { ErrorValidation, ErrorUnexpected, HttpError } from "../error/errors.js";
import { PitchSubmission, PitchSettingsUpdate } from "../models/zodSchemas/pitch.js";
import EmailAccessor from "../databaseAccessors/emailAccessor.js";
import { GenerateEmail, ResendEmail } from "../services/email/emailService.js";

export default class PitchController {
  static async getSettings(req, res) {
    try {
      const eligibleRecipients = await PitchAccessor.getEligibleRecipients();
      const settings = await PitchAccessor.getSettings();

      res.status(200).json({
        eligibleRecipients,
        recipientIds: settings?.recipientIds.map((id) => id.toString()) ?? [],
      });
    } catch (e) {
      if (e instanceof HttpError) {
        e.throwHttp(req, res);
      } else {
        new ErrorUnexpected(e.message).throwHttp(req, res);
      }
    }
  }

  static async updateSettings(req, res) {
    try {
      const parsed = PitchSettingsUpdate.safeParse(req.body);

      if (!parsed.success) {
        throw new ErrorValidation(parsed.error.issues[0].message);
      }

      const recipientIds = [...new Set(parsed.data.recipientIds.map((id) => id.toLowerCase()))];

      const eligibleRecipients = await PitchAccessor.getEligibleRecipients();
      const eligibleIds = new Set(eligibleRecipients.map((user) => user._id.toString()));

      if (!recipientIds.every((id) => eligibleIds.has(id))) {
        throw new ErrorValidation("Recipients must be admins graduating this year or later.");
      }

      const settings = await PitchAccessor.updateSettings(recipientIds);

      res.status(200).json({
        recipientIds: settings.recipientIds.map((id) => id.toString()),
      });
    } catch (e) {
      if (e instanceof HttpError) {
        e.throwHttp(req, res);
      } else {
        new ErrorUnexpected(e.message).throwHttp(req, res);
      }
    }
  }

  static async submitPitch(req, res) {
    try {
      const parsed = PitchSubmission.safeParse(req.body);

      if (!parsed.success) {
        throw new ErrorValidation(parsed.error.issues[0].message);
      }

      const settings = await PitchAccessor.getSettings();

      if (!settings?.recipientIds.length) {
        throw new ErrorUnexpected("Pitch submissions are temporarily unavailable. Please try again later.");
      }

      const recipients = (await PitchAccessor.getSelectedRecipients(settings.recipientIds)).map((user) => user.email);

      if (!recipients.length) {
        throw new ErrorUnexpected("Pitch submissions are temporarily unavailable. Please try again later.");
      }

      const email = GenerateEmail.ArticlePitch(parsed.data, recipients);

      await ResendEmail.sendEmailWithTemplate(email);

      // A logging failure should not make a sent pitch appear to have failed.
      try {
        await EmailAccessor.createEmail(email);
      } catch (logError) {
        console.error("Failed to record pitch email:", logError.message);
      }

      res.status(200).json({
        message: "Thank you for your pitch! We will reach out via email.",
      });
    } catch (e) {
      console.error("Pitch submission failed:", e);

      if (e instanceof HttpError) {
        e.throwHttp(req, res);
      } else {
        new ErrorUnexpected(e.message).throwHttp(req, res);
      }
    }
  }
}
