import mongoose from "mongoose";
import MockConnection from "../tests/util/mockConnection.js";
import User from "../app/models/dbModels/user.js";
import Article from "../app/models/dbModels/article.js";
import Categories from "../app/models/enums/categories.js";
import ArticleContent from "../app/models/enums/articleContent.js";
import CommentStatus from "../app/models/enums/commentStatus.js";
import ArticleStatus from "../app/models/enums/articleStatus.js";
import DesignStatus from "../app/models/enums/designStatus.js";
import WritingStatus from "../app/models/enums/writingStatus.js";
import PhotographyStatus from "../app/models/enums/photographyStatus.js";

const Schema = mongoose.Schema;

//article schema
const OldArticleSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    issueNumber: { type: Number },
    categories: [{ type: String, enum: Categories.listr(), required: true }],
    articleContent: [
      [
        {
          contentType: { type: String, enum: ArticleContent.listr(), required: true },
          content: { type: String, required: true },
          href: { type: String },
        },
      ],
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
    authors: [{ type: String }],
    editors: [{ type: Schema.Types.ObjectId, ref: User }],
    designers: [{ type: Schema.Types.ObjectId, ref: User }],
    photographers: [{ type: Schema.Types.ObjectId, ref: User }],
    approvingUser: { type: Schema.Types.ObjectId, ref: User },
    approvalTime: { type: Date, default: Date.now },
    creationTime: { type: Date, required: true, default: Date.now },
    modificationTime: { type: Date, required: true, default: Date.now },
  },
  {
    //saved to the collection "article"
    collection: "articles",
  }
);

// Add a text index for title and articleContent.content
OldArticleSchema.index({ title: "text", "articleContent.content": "text" }, { name: "article_text_index" });

const db = mongoose.connection.useDb("articles");
const OldArticle = db.model("Articles", OldArticleSchema);

async function migrate() {
  await MockConnection.open();
  let totalArticlesModified = 0;
  let authorsWithArticles = 0;

  const users = await User.find({});

  for (const user of users) {
    let articlesPerAuthor = 0;
    const name = `${user.firstName} ${user.lastName}`;
    const mongoId = user._id;

    const articlesByAuthor = await OldArticle.find({ authors: name });
    for (const article of articlesByAuthor) {
      article.authors = [mongoId];
      const newArticle = new Article(article);
      newArticle.save();
      articlesPerAuthor++;
      totalArticlesModified++;
    }

    if (articlesPerAuthor > 0) {
      authorsWithArticles++;
    }

    console.log(`${name}: ${articlesPerAuthor}`);
  }

  console.log("\nTotal Articles Modified: ", totalArticlesModified);
  console.log("\nAuthors with Articles: ", authorsWithArticles);
}

await migrate();
