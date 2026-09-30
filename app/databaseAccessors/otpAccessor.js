import OTPToken from "../auth/opt.js";
import Connection from "../db/connection.js";
import OTPModel from "../models/dbModels/otp.js";

/**
 * OTPAccessor Class
 *
 * All methods pertaining to accessing and sending
 * one-time token data to the MongoDB Cluster are in this class.
 */
export default class OTPAccessor {
  /**
   * createOTPRecord Method
   *
   * This method creates a one-time token record. Only the hash
   * of the token is stored, never the raw token.
   *
   * @param {String} email the email the token is bound to
   * @param {String} hashedToken the hash from OTPToken.generate()
   * @param {Object} options optional { purpose, roles, invitedBy, expiresAt }.
   *                 Omitted values fall back to the model defaults (login, 15 minutes).
   * @returns the saved OTP record
   */
  static async createOTPRecord(email, hashedToken, options = {}) {
    await Connection.open();
    const otpRecord = new OTPModel({ email: email, token: hashedToken, ...options });
    // Awaited so the record exists before the email containing its link is sent.
    await otpRecord.save();
    return otpRecord;
  }

  /**
   * verifyOTPRecord Method
   *
   * This method uses up a token by marking an unused, unexpired
   * record with the given purpose as used.
   *
   * @param {String} token the raw token from the link
   * @param {String} purpose "login" or "invite"
   * @returns {Object} { success, email, roles, invitedBy }
   */
  static async verifyOTPRecord(token, purpose) {
    await Connection.open();
    // Atomic, so a token can only be used once, even with simultaneous requests.
    const usedOTP = await OTPModel.findOneAndUpdate(OTPAccessor.validOTPFilter(token, purpose), { used: true });

    return {
      success: !!usedOTP,
      email: usedOTP?.email,
      roles: usedOTP?.roles,
      invitedBy: usedOTP?.invitedBy,
    };
  }

  /**
   * findValidOTP Method
   *
   * This method checks a token without using it up.
   *
   * @param {String} token the raw token from the link
   * @param {String} purpose "login" or "invite"
   * @returns the matching OTP record, or null
   */
  static async findValidOTP(token, purpose) {
    await Connection.open();
    // Read-only, so opening the signup page does not burn the invite.
    const otpRecord = await OTPModel.findOne(OTPAccessor.validOTPFilter(token, purpose));
    return otpRecord;
  }

  /**
   * releaseOTPRecord Method
   *
   * This method marks a used token as unused again.
   *
   * @param {String} token the raw token from the link
   */
  static async releaseOTPRecord(token) {
    await Connection.open();
    // Only for server-side failures after verifyOTPRecord, never user-caused ones.
    await OTPModel.updateOne({ token: OTPToken.hash(token) }, { used: false });
  }

  /**
   * validOTPFilter Method
   *
   * This method builds the query shared by verifyOTPRecord and findValidOTP.
   *
   * @param {String} token the raw token from the link
   * @param {String} purpose "login" or "invite"
   * @returns {Object} MongoDB filter
   */
  static validOTPFilter(token, purpose) {
    // Mongoose drops undefined filter values, so a missing purpose would match any token.
    if (!purpose) {
      throw new Error("OTP purpose is required.");
    }
    return {
      token: OTPToken.hash(token),
      purpose: purpose,
      used: false,
      expiresAt: { $gt: new Date() },
    };
  }
}
