import mongoose from "mongoose";

const Schema = mongoose.Schema;
const model = mongoose.model;

// article Schema
const PendingArticleSchema = new Schema(
  {
    title: String,
    author: String,
    year: Number,
    major: String,
    categories: [{ type: String }],
    date: Date,
    coverImage: String,
    images: [{ type: String }],
    body: [{ type: String }],
    pullquotes: [{ type: String }],
    sources: [{ type: String }],
    theme: String,
    elementOrder: [{ type: String }],
  },
  {
    collection: "pending-articles",
  }
);

const db = mongoose.connection.useDb("articles");

// article model
const PendingArticle = db.model("Article", PendingArticleSchema);

export default PendingArticle;
