import mongoose from "mongoose";

const Schema = mongoose.Schema;

//issue map schema
const IssueMapSchema = new Schema(
  {
    issueNumber: { type: Number, required: true },
    issueName: { type: String, required: true, unique: true },
    sections: [
      {
        sectionName: { type: String, required: true, unique: true },
        color: { type: String, required: true },
        creatingUser: { type: Schema.Types.ObjectId, ref: "Users", required: true },
        articles: [{ type: Schema.Types.ObjectId }],
        creationTime: { type: Date, required: true },
        modificationTime: { type: Date, required: true },
      },
    ],
    articles: [{ type: Schema.Types.ObjectId, ref: "Articles", unique: true }],
    pages: { type: Number, required: true },
    creatingUser: { type: Schema.Types.ObjectId, ref: "Users", required: true },
    creationTime: { type: Date, required: true },
    modificationTime: { type: Date, required: true },
  },
  {
    //saved to the collection "issue_map"
    collection: "issue_maps",
  }
);

const db = mongoose.connection.useDb("issue_maps");
const IssueMap = db.model("IssueMap", IssueMapSchema);

export default IssueMap;
