import mongoose from "mongoose";
import ArticleStatus from "./enums/article_status";
import WritingStatus from "./enums/writing_status";
import CommentStatus from "./enums/comment_status";
import DesignStatus from "./enums/design_status";
import PhotographyStatus from "./enums/photography_status";
import ArticleContent from "./enums/article_content.js";

const Schema = mongoose.Schema;

const ArticleContentSchema = new Schema({
  contentType: { type: ArticleContent.listStr, required: true },
  content: { type: String, required: true },
});

const CommentSchema = new Schema({
  user: { type: Schema.Types.ObjectId, required: true },
  comment: { type: String, required: true },
  commentStatus: { type: String, enum: CommentStatus.listStr, required: true },
  creationTime: { type: Date, required: true },
  modificationTime: { type: Date, required: true },
});

//article schema
const ArticleSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    issueNumber: { type: Number },
    categories: { type: [String], required: true },
    articleContent: { type: [ArticleContentSchema] },
    sources: { type: [String], required: true },
    link: { type: String },
    pageLength: { type: Number, required: true },
    comments: [CommentSchema],
    articleStatus: { type: String, enum: ArticleStatus.listStr, required: true },
    writingStatus: { type: String, enum: WritingStatus.listStr, required: true },
    designStatus: { type: String, enum: DesignStatus.listStr, required: true },
    photographyStatus: { type: String, enum: PhotographyStatus.listStr, required: true },
    authors: { type: [Schema.Types.ObjectId] },
    editors: { type: [Schema.Types.ObjectId] },
    designers: { type: [Schema.Types.ObjectId] },
    photographers: { type: [Schema.Types.ObjectId] },
    approvingUser: { type: Schema.Types.ObjectId },
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
