import mongoose from "mongoose";
import ArticleStatus from "./enums/article_status.js";
import WritingStatus from "./enums/writing_status.js";
import CommentStatus from "./enums/comment_status.js";
import DesignStatus from "./enums/design_status.js";
import PhotographyStatus from "./enums/photography_status.js";
import ArticleContent from "./enums/article_content.js";
import Categories from "./enums/categories.js";

const Schema = mongoose.Schema;

//article schema
const ArticleSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    issueNumber: { type: Number },
    categories: [{ type: String, enum: Categories.listr(), required: true }],
    articleContent: [
      {
        contentType: { type: ArticleContent.listStr, required: true },
        content: { type: String, required: true },
      },
    ],
    sources: [{ type: String, required: true }],
    link: { type: String },
    pageLength: { type: Number, required: true },
    comments: [
      {
        user: { type: Schema.Types.ObjectId, ref: "Users", required: true },
        comment: { type: String, required: true },
        commentStatus: { type: String, enum: CommentStatus.listStr, required: true },
        creationTime: { type: Date, required: true },
        modificationTime: { type: Date, required: true },
      },
    ],
    articleStatus: { type: String, enum: ArticleStatus.listStr, required: true },
    writingStatus: { type: String, enum: WritingStatus.listStr, required: true },
    designStatus: { type: String, enum: DesignStatus.listStr, required: true },
    photographyStatus: { type: String, enum: PhotographyStatus.listStr, required: true },
    authors: [{ type: Schema.Types.ObjectId, ref: "Users" }],
    editors: [{ type: Schema.Types.ObjectId, ref: "Users" }],
    designers: [{ type: Schema.Types.ObjectId, ref: "Users" }],
    photographers: [{ type: Schema.Types.ObjectId, ref: "Users" }],
    approvingUser: { type: Schema.Types.ObjectId, ref: "Users" },
    approvalTime: { type: Date },
    creationTime: { type: Date, required: true },
    modificationTime: { type: Date, required: true },
  },
  {
    //saved to the collection "article"
    collection: "articles",
  }
);
const db = mongoose.connection.useDb("articles");
const Article = db.model("Articles", ArticleSchema);

export default Article;
