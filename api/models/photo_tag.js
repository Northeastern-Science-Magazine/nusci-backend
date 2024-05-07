import { ObjectId } from "mongodb";
import mongoose from "mongoose";

const Schema = mongoose.Schema;

//photo tag schema
const PhotoTagSchema = new Schema(
    {
        tagName: { type: String, unique: true, required: true },
        color: { type: String, required: true },
        creatingUser: { type: ObjectId, required: true},
        creationTime: { type: Date, required: true},
        modificationTime: { type: Date, required: true},
    }, 
    {
        //saved to the collection "photo-tag"
        collection: "photo_tag",
    }
);

//photo tag model: change "photos" to name of the db
const db = mongoose.connection.useDb("photo");
const PhotoTag = db.model("photoTag", PhotoTagSchema);

export default PhotoTag;