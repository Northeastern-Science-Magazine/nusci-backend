import mongoose from "mongoose";

const Schema = mongoose.Schema;

// email schema
const EmailSchema = new Schema(
  // add hte needed schema
  {},
  {
    //saved to the collection "article"
    collection: "emails",
  }
);

const db = mongoose.connection.useDb("emails");
const Email = db.model("Email", EmailSchema);

export default Email;
