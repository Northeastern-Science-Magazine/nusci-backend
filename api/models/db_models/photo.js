import mongoose from "mongoose";

const Schema = mongoose.Schema;

//photo schema
const PhotoSchema = new Schema(
  {
    url: { type: String, unique: true, required: true },
    tags: [{ type: Schema.Types.ObjectId, ref: "PhotoTags" }],
    photographers: [{ type: Schema.Types.ObjectId, ref: "Users", required: true }],
    photoTime: { type: Date },
    rights: { type: String, required: true, default: "" },
    creationTime: { type: Date, required: true },
    modificationTime: { type: Date, required: true },
  },
  {
    //saved to the collection "photo"
    collection: "photos",
  }
);
const db = mongoose.connection.useDb("photos");
const Photo = db.model("Photos", PhotoSchema);

export default Photo;
