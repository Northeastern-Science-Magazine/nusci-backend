import mongoose from "mongoose";
import Accounts from "../enums/accounts.js";

const Schema = mongoose.Schema;

const OTPSchema = new Schema(
  {
    email: { type: String, required: true },
    token: { type: String, required: true, unique: true }, // hashed token
    expiresAt: { type: Date, default: () => new Date(Date.now() + 15 * 60 * 1000) },
    used: { type: Boolean, required: true, default: false },
    // Added the two purposes to make sure the token expires in 7 days if not signed up
    // (invites get their own rules; login tokens keep the 15-minute default), and that a
    // used or forwarded invite link can't be replayed at /user/verify-otp to log in.
    purpose: { type: String, enum: ["login", "invite"], required: true, default: "login" },
    // Roles the new user receives at signup. Only set on "invite" records.
    roles: [{ type: String, enum: Accounts.listr() }],
    // The admin who sent the invite. Copied into the new user's approvingUser.
    invitedBy: { type: Schema.Types.ObjectId },
  },
  {
    collection: "otp",
  }
);
const db = mongoose.connection.useDb("users");
const OTPModel = db.model("OTP", OTPSchema);

export default OTPModel;
