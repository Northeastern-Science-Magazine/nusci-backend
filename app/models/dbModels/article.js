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
      },
    ],
    sources: [{ type: String }],
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
    authors: [{ type: Schema.Types.ObjectId, ref: User }],
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

ArticleSchema.pre('deleteOne', { document: true, query: false }, async function() {
  try {
    await mongoose.model('IssueMap').updateMany(
      { articles: this._id },
      { $pull: { articles: this._id } }
    );
  } catch (e) {
    console.error('Error in pre-deleteOne hook:', e);
  }
});

const db = mongoose.connection.useDb("articles");
const Article = db.model("Articles", ArticleSchema);

export default Article;
