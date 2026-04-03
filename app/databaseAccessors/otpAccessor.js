import OTPToken from "../auth/opt.js";
import Connection from "../db/connection.js";
import OTPModel from "../models/dbModels/otp.js";

export default class OTPAccessor {
  static async createOTPRecord(email, hashedToken) {
    await Connection.open();
    const otpRecord = new OTPModel({ email: email, token: hashedToken });
    otpRecord.save();
    return otpRecord;
  }

  static async verifyOTPRecord(token) {
    await Connection.open();
    const updatedOTP = await OTPModel.findOneAndUpdate({ token: OTPToken.hash(token), used: false }, { used: true });
    let success;
    if (!updatedOTP) {
      success = false;
    } else {
      success = true;
    }

    return { success: success, email: updatedOTP?.email };
  }
}
