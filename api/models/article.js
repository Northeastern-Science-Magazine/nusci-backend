import { ObjectId } from "mongodb";
import mongoose from "mongoose";
import ArticleStatus from "./enums/article_status";
import WritingStatus from "./enums/writing_status";
import InternalCommentStatus from "./enums/internal_comment_status";
import DesignStatus from "./enums/design_status";
import PhotographyStatus from "./enums/photography_status";

const Schema = mongoose.Schema;

//article schema
const ArticleSchema = new Schema(
  {
    title: { type: String, required: true },
    authors: [{ type: ObjectId, required: true }],
    categories: { type: [String], required: true },
    sources: { type: [String], required: true },
    ArticleContent: [
      {
        contentType: { type: String, enum: ["PullQuote", "body", "image"], required: true },
        content: { type: String, required: true },
      },
    ],
    slug: { type: String, required: true, unique: true },
    articleStatus: {
      type: String,
      enum: [ArticleStatus.Pending.status, ArticleStatus.Print.status, ArticleStatus.Online.status],
      required: true,
    },
    writingStatus: {
      type: String,
      enum: [
        WritingStatus.Dropped.status,
        WritingStatus.Edits_Complete.status,
        WritingStatus.Eic_Approved.status,
        WritingStatus.Has_Editor.status,
        WritingStatus.Rough_Draft_Complete.status,
        WritingStatus.Copy_Edits_Complete.status,
        WritingStatus.Needs_Editor.status,
      ],
      required: true,
    },
    issueNumber: { type: Number },
    editors: { type: [ObjectId] },
    Comments: [
      {
        user: { type: ObjectId, required: true },
        comment: { type: String, required: true },
        commentStatus: {
          type: String,
          enum: [
            InternalCommentStatus.Public.status,
            InternalCommentStatus.Unresolved.status,
            InternalCommentStatus.Resolved.status,
          ],
          required: true,
        },
        creationTime: { type: Date, required: true },
        modificationTime: { type: Date, required: true },
      },
    ],
    link: { type: String },
    pageLength: { type: Number, required: true },
    designers: { type: [ObjectId] },
    designStatus: {
      type: [String],
      enum: [
        DesignStatus.Completed.status,
        DesignStatus.Has_Designer.status,
        DesignStatus.Needs_Designer.status,
        DesignStatus.In_Progress.status,
      ],
      required: true,
    },
    photographers: {
      type: [ObjectId],
    },
    photographyStatus: {
      type: String,
      required: true,
      enum: [
        PhotographyStatus.Needs_Photographer.status,
        PhotographyStatus.No_Photo.status,
        PhotographyStatus.Photo_Complete.status,
        PhotographyStatus.Photographer_Assigned.status,
      ],
    },
    approvingUser: { type: ObjectId },
    approvalTime: { type: Date },
    creationTime: { type: Date, required: true },
    modificationTime: { type: Date, required: true },
  },
  {
    //saved to the collection "article"
    collection: "article",
  }
);
const db = mongoose.connection.useDb("articles");
const Article = db.model("Article", ArticleSchema);

export default Article;
