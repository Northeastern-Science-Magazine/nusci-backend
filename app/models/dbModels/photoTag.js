import mongoose from "mongoose";
import User from "./user.js";

const Schema = mongoose.Schema;

//photo tag schema
const PhotoTagSchema = new Schema(
  {
    tagName: { type: String, unique: true, required: true },
    color: { type: String, required: true },
    creatingUser: { type: Schema.Types.ObjectId, ref: User, required: true },
    creationTime: { type: Date, required: true },
    modificationTime: { type: Date, required: true },
  },
  {
    //saved to the collection "photo-tag"
    collection: "photo_tags",
  }
);

const db = mongoose.connection.useDb("photos");
const PhotoTag = db.model("PhotoTags", PhotoTagSchema);

export default PhotoTag;
