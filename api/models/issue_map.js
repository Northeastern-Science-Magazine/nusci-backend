import { ObjectId } from "mongodb";
import mongoose from "mongoose";

const Schema = mongoose.Schema;

//issue map schema
const IssueMapSchema = new Schema(
  {
    ObjectId: { type: ObjectId, required: true, unique: true },
    issueNumber: { type: Number, required: true },
    issueName: { type: String, required: true, unique: true },
    sections: {
      objectId: { type: ObjectId, required: true },
      sectionName: { type: String, required: true, unique: true },
      color: { type: String, required: true },
      creatingUser: { type: ObjectId, required: true },
      articles: [{ type: ObjectId }],
      creationTime: { type: Date, required: true },
      modificationTime: { type: Date, required: true },
    },
    articles: [{ type: ObjectId, unique: true }],
    pages: { type: Number, required: true },
    creatingUser: { type: ObjectId, required: true },
    creationTime: { type: Date, required: true },
    modificationTime: { type: Date, required: true },
  },
  {
    //saved to the collection "issue_map"
    collection: "issue_map",
  }
);

const db = mongoose.connection.useDb("issue_map");
const IssueMap = db.model("IssueMap", IssueMapSchema);

export default IssueMap;
