import mongoose from "mongoose";

const Schema = mongoose.Schema;

//archived issue schema: a published print issue whose PDF lives in S3.
//deleting only flags the issue, the record and its S3 files are kept so it can be
//restored by setting deleted back to false (and unsetting deletionTime/deletingUser)
const ArchivedIssueSchema = new Schema(
  {
    issueNumber: { type: Number, required: true },
    title: { type: String, required: true },
    publicationDate: { type: Date, required: true },
    pdfKey: { type: String, required: true }, // S3 key, i.e. prod/archive/<uuid>.pdf
    coverKey: { type: String }, // S3 key of the cover image, i.e. prod/archive/<uuid>.png
    creatingUser: { type: Schema.Types.ObjectId, ref: "Users", required: true },
    creationTime: { type: Date, required: true },
    modificationTime: { type: Date, required: true },
    deleted: { type: Boolean, required: true, default: false },
    deletionTime: { type: Date },
    deletingUser: { type: Schema.Types.ObjectId, ref: "Users" },
  },
  {
    //saved to the collection "archived_issues"
    collection: "archived_issues",
  }
);

//issue numbers are unique among issues that haven't been deleted,
//so a deleted issue can be archived again
ArchivedIssueSchema.index({ issueNumber: 1 }, { unique: true, partialFilterExpression: { deleted: false } });

const db = mongoose.connection.useDb("issue_maps");
const ArchivedIssue = db.model("ArchivedIssue", ArchivedIssueSchema);

export default ArchivedIssue;
