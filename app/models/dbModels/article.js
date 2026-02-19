import mongoose from "mongoose";
import ArticleStatus from "../enums/articleStatus.js";
import WritingStatus from "../enums/writingStatus.js";
import CommentStatus from "../enums/commentStatus.js";
import DesignStatus from "../enums/designStatus.js";
import PhotographyStatus from "../enums/photographyStatus.js";
import ArticleContent from "../enums/articleContent.js";
import Categories from "../enums/categories.js";
import User from "./user.js";

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
        contentType: { type: String, enum: ArticleContent.listr(), required: true },
        content: { type: String, required: true },
        href: { type: String }, 
      },
    ],
    sources: [
      {
        text: { type: String, required: true },
        href: { type: String },
      },
    ],
    link: { type: String },
    pageLength: { type: Number, required: true },
    comments: [
      {
        user: { type: Schema.Types.ObjectId, ref: User, required: true },
        comment: { type: String, required: true },
        commentStatus: { type: String, enum: CommentStatus.listr(), required: true },
        creationTime: { type: Date, required: true },
        modificationTime: { type: Date, required: true },
      },
    ],
    articleStatus: { type: String, enum: ArticleStatus.listr(), required: true },
    writingStatus: { type: String, enum: WritingStatus.listr(), required: true },
    designStatus: { type: String, enum: DesignStatus.listr(), required: true },
    photographyStatus: { type: String, enum: PhotographyStatus.listr(), required: true },
    authors: [{ type: String }], // string for now, but later ref to a user
    editors: [{ type: Schema.Types.ObjectId, ref: User }],
    designers: [{ type: Schema.Types.ObjectId, ref: User }],
    photographers: [{ type: Schema.Types.ObjectId, ref: User }],
    approvingUser: { type: Schema.Types.ObjectId, ref: User },
    approvalTime: { type: Date },
    creationTime: { type: Date, required: true },
    modificationTime: { type: Date, required: true },
  },
  {
    //saved to the collection "article"
    collection: "articles",
  }
);

// Add a text index for title and articleContent.content
ArticleSchema.index({ title: "text", "articleContent.content": "text" }, { name: "article_text_index" });

const db = mongoose.connection.useDb("articles");
const Article = db.model("Articles", ArticleSchema);

export default Article;
