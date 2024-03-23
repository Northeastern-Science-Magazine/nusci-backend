import mongoose from "mongoose";

const Schema = mongoose.Schema;
const model = mongoose.model;

/**
 * UserSchema
 *
 * Mongoose Schema defined for Registered Users.
 */
const RegisteredUser = new Schema(
  {
    username: { type: String, unique: true, required: true },
    role: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    information: {
      year: Number,
      major: String,
      bio: String,
      image: String,
    },
  },
  {
    //Defines the collection objects of this schema get saved to.
    collection: "registered",
  }
);

// User model
const db = mongoose.connection.useDb("users");
const RegisteredUserSchema = db.model("RegisteredUser", RegisteredUser);

export default RegisteredUserSchema;
