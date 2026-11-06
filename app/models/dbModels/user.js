import mongoose from "mongoose";
import Accounts from "../enums/accounts.js";
import AccountStatus from "../enums/accountStatus.js";

const Schema = mongoose.Schema;

//user schema
const UserSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    // An author an editor adds before they sign up has no password or graduation
    // year until they accept their invite (see UserController.createAuthor).
    password: { type: String },
    pronouns: { type: [String] },
    graduationYear: { type: Number },
    major: { type: String },
    location: { type: String },
    profileImage: { type: String },
    bannerImage: { type: String },
    bio: { type: String },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    roles: [{ type: String, enum: Accounts.listr(), required: true }],
    status: { type: String, enum: AccountStatus.listr(), required: true },
    approvingUser: { type: Schema.Types.ObjectId },
    gameData: { type: Schema.Types.ObjectId },
    creationTime: { type: Date, required: true },
    modificationTime: { type: Date, required: true },
  },
  {
    //saved to the collection "user"
    collection: "users",
  }
);
const db = mongoose.connection.useDb("users");
const User = db.model("Users", UserSchema);

export default User;
