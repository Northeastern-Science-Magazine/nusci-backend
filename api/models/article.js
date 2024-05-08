import mongoose from "mongoose";
import ArticleStatus from "./enums/article_status";
import WritingStatus from "./enums/writing_status";
import InternalCommentStatus from "./enums/internal_comment_status";
import DesignStatus from "./enums/design_status";
import PhotographyStatus from "./enums/photography_status";

const Schema = mongoose.Schema;

/**
 * subdocument schema for pull quotes and validation method for mixed schema
 */
const PullQuoteSchema = new Schema({
  quote: { type: String, required: true },
});

const isPullQuote = (content) => {
  return typeof content.quote === "string";
};

/**
 * subdocument schema for body paragraphs and validation method for mixed schema
 */
const BodyParagraphSchema = new Schema({
  paragraph: { type: String, required: true },
});

const isBodyParagraph = (content) => {
  return typeof content.paragraph === "string";
};

/**
 * subdocument schema for images and validation method for mixed schema
 */
const ImageSchema = new Schema({
  image: { type: String, required: true },
});

const isImage = (content) => {
  return typeof content.image === "string";
};

/**
 * function that validates the mixed data types in the article content array,
 * returns false if the array's subdocuments do not match the schemas
 */
const validateArticleContent = (content) => {
  //invalidate if items in the array are not of the correct type
  for (let i = 0; i < content.length; i++) {
    if (content[i].quote) {
      if (PullQuoteSchema.validateSync(content[i]).errors) {
        return false;
      }
    } else if (content[i].paragraph) {
      if (BodyParagraphSchema.validateSync(content[i]).errors) {
        return false;
      }
    } else if (content[i].image) {
      if (ImageSchema.validateSync(content[i]).errors) {
        return false;
      }
    } else {
      return false;
    }
  }
  return true;
};

//article schema
const ArticleSchema = new Schema(
  {
    title: { type: String, required: true },
    authors: { type: [Schema.Types.ObjectId], required: true },
    categories: { type: [String], required: true },
    sources: { type: [String], required: true },
    ArticleContent: {
      type: [Schema.Types.Mixed],
      validator: validateArticleContent,
    },
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
    editors: { type: [Schema.Types.ObjectId] },
    Comments: [
      {
        user: { type: Schema.Types.ObjectId, required: true },
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
    designers: { type: [Schema.Types.ObjectId] },
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
      type: [Schema.Types.ObjectId],
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
