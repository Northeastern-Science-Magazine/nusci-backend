import { ObjectId } from "mongodb";
import mongoose from "mongoose";

const Schema = mongoose.Schema;

//photo schema
const PhotoSchema = new Schema(
  {
    url: { type: String, unique: true, required: true },
    tags: [{ type: ObjectId, ref: "photo_tag", required: true }],
    photographers: { type: [ObjectId], required: true },
    photoTime: { type: Date, required: true },
    rights: { type: String, required: true, default: ""},
    creationTime: { type: Date, required: true },
    modificationTime: { type: Date, required: true },
  },
  {
    //saved to the collection "photo"
    collection: "photo",
  }
);
const db = mongoose.connection.useDb("photo");
const Photo = db.model("Photo", PhotoSchema);

export default Photo;
