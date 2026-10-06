import mongoose from "mongoose";

const Schema = mongoose.Schema;

//issue map schema
const IssueMapSchema = new Schema(
  {
    issueNumber: { type: Number, required: true, unique: true },
    issueName: { type: String, required: true, unique: true },
    sections: [
      {
        sectionName: { type: String, required: true },
        color: { type: String, required: true },
        creatingUser: { type: Schema.Types.ObjectId, ref: "Users", required: true },
        articles: [{ type: Schema.Types.ObjectId }],
        creationTime: { type: Date, required: true },
        modificationTime: { type: Date, required: true },
      },
    ],
    articles: [{ type: Schema.Types.ObjectId, ref: "Articles" }],
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

// An article can belong to at most one issue. Partial so that issues with no
// articles yet don't collide with each other on an empty-array key.
IssueMapSchema.index({ articles: 1 }, { unique: true, partialFilterExpression: { "articles.0": { $exists: true } } });

const db = mongoose.connection.useDb("issue_maps");
const IssueMap = db.model("IssueMap", IssueMapSchema);

export default IssueMap;
