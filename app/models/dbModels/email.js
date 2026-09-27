import mongoose from "mongoose";
import EmailType from "../enums/emailType.js";

const Schema = mongoose.Schema;

/**
 * Email Schema, used only for
 * record keeping of emails
 * our system has sent out.
 */
const EmailSchema = new Schema(
  {
    to: { type: [String], required: true },
    from: { type: String, required: true },
    type: { type: String, enum: EmailType.listr(), required: true },
    variables: { type: Object },
    creationTime: { type: Date, default: Date.now },
    modificationTime: { type: Date, default: Date.now },
  },
  {
    //saved to the collection "email"
    collection: "email",
  }
);
const db = mongoose.connection.useDb("email");
const Email = db.model("Email", EmailSchema);

export default Email;
