import { ObjectId } from "mongodb";
import mongoose from "mongoose";
import Accounts from "../auth/accounts.js";
import AccountStatus from "./enums/account_status";

const Schema = mongoose.Schema;

//user schema
const UserSchema = new Schema(
  {
    ObjectId: { type: ObjectId, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    pronouns: { type: [String] },
    graduationYear: { type: Number, required: true },
    majors: { type: [String] },
    location: { type: String },
    profileImage: { type: String },
    bannerImage: { type: String },
    bio: { type: String },
    emails: { type: [String], required: true, unique: true },
    phone: { type: String, unique: true },
    roles: {
      type: [String],
      enum: [
        Accounts.None.role,
        Accounts.Author.role,
        Accounts.Editor.role,
        Accounts.Photographer.role,
        Accounts.Developer.role,
        Accounts.Admin.role,
      ],
      required: true,
    },
    status: {
      type: String,
      enum: [
        AccountStatus.Pending.status,
        AccountStatus.Deactivated.status,
        AccountStatus.Approved.status,
      ],
      required: true,
    },
    approvingUser: { type: ObjectId },
    gameData: {type : ObjectId }, 
    creationTime: { type: Date, required: true },
    modificationTime: { type: Date, required: true },
  },
  {
    //saved to the collection "user"
    collection: "user",
  }
);
const db = mongoose.connection.useDb("user");
const User = db.model("User", UserSchema);

export default User;
