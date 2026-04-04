import mongoose from "mongoose";

const Schema = mongoose.Schema;

const OTPSchema = new Schema(
  {
    email: { type: String, required: true },
    token: { type: String, required: true, unique: true }, // hashed token
    expiresAt: { type: Date, default: () => new Date(Date.now() + 15 * 60 * 1000) },
    used: { type: Boolean, required: true, default: false },
  },
  {
    collection: "otp",
  }
);
const db = mongoose.connection.useDb("users");
const OTPModel = db.model("OTP", OTPSchema);

export default OTPModel;
