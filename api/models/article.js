import mongoose from "mongoose";
import ArticleStatus from "./helper.js";
const Schema = mongoose.Schema;
const model = mongoose.model;

/**
 * Approved Article Schema
 */
const ArticleSchema = new Schema(
  {
    title: String,
    author: String,
    authorUsername: String,
    year: Number,
    major: String,
    categories: [{ type: String }],
    date: Date,
    coverImage: String,
    images: [{ type: String }],
    body: [{ type: String }],
    pullquotes: [{ type: String }],
    sources: [{ type: String }],
    comments: [
      {
        author: String,
        date: Date,
        body: String,
      },
    ],

    status: [
      {
        type: String,
        required: true,
        enum: Object.values(ArticleStatus),
        default: ArticleStatus.IN_PROGRESS,
      },
    ],
    theme: String,
    elementOrder: [{ type: String }],
    approver: String,
  },
  {
    collection: "articles",
  }
);

const db = mongoose.connection.useDb("articles");

// article model
const Article = db.model("Article", ArticleSchema);

export default Article;
