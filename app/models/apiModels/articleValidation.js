import { UserPublicResponse } from "./user.js";
import ArticleContent from "../enums/articleContent.js";
import ArticleStatus from "../enums/articleStatus.js";
import Category from "../enums/categories.js";
import DesignStatus from "../enums/designStatus.js";
import PhotographyStatus from "../enums/photographyStatus.js";
import WritingStatus from "../enums/writingStatus.js";
import CommentStatus from "../enums/commentStatus.js";

export const articleUpdateSchema = {
  type: "object",
  properties: {
    title: { type: "string" },
    slug: { type: "string" },
    issueNumber: { type: "integer" },
    categories: {
      type: "array",
      items: { type: "string", enum: Category.listr() },
    },
    articleContent: {
      type: "array",
      items: {
        type: "object",
        properties: {
          contentType: { type: "string", enum: ArticleContent.listr() },
          content: { type: "string" },
        },
        required: ["contentType", "content"],
      },
    },
    sources: { type: "array", items: { type: "string" } },
    pageLength: { type: "integer" },
    comments: {
      type: "array",
      items: {
        type: "object",
        properties: {
          user: UserPublicResponse.schema, // Refer to your user schema
          comment: { type: "string" },
          commentStatus: { type: "string", enum: CommentStatus.listr() },
          creationTime: { type: "string", format: "date-time" },
          modificationTime: { type: "string", format: "date-time" },
        },
        required: ["comment", "commentStatus", "creationTime", "modificationTime"],
      },
    },
    articleStatus: { type: "string", enum: ArticleStatus.listr() },
    authors: { type: "array", items: { type: "string" } },
    editors: { type: "array", items: { type: "string" } },
    designers: { type: "array", items: { type: "string" } },
    photographers: { type: "array", items: { type: "string" } },
    approvingUser: { type: "string" },
    approvalTime: { type: "string", format: "date-time" },
    modificationTime: { type: "string", format: "date-time", default: new Date().toISOString() },
  },
  additionalProperties: false,
};

export const articleResponseSchema = {
  type: "object",
  properties: {
    title: { type: "string" },
    slug: { type: "string" },
    issueNumber: { type: "integer" },
    categories: {
      type: "array",
      items: { type: "string", enum: Category.listr() },
    },
    articleContent: {
      type: "array",
      items: {
        type: "object",
        properties: {
          contentType: { type: "string", enum: ArticleContent.listr() },
          content: { type: "string" },
        },
        required: ["contentType", "content"], // Ensure both contentType and content are required
      },
    },
    sources: { type: "array", items: { type: "string" } },
    link: { type: "string" },
    pageLength: { type: "integer" },
    comments: {
      type: "array",
      items: {
        type: "object",
        properties: {
          user: UserPublicResponse.schema, // Reference the schema directly
          comment: { type: "string" },
          commentStatus: { type: "string", enum: CommentStatus.listr() },
          creationTime: { type: "string", format: "date-time" },
          modificationTime: { type: "string", format: "date-time" },
        },
        required: ["comment", "commentStatus", "creationTime", "modificationTime"], // Required comment fields
      },
    },
    articleStatus: { type: "string", enum: ArticleStatus.listr() },
    writingStatus: { type: "string", enum: WritingStatus.listr() },
    designStatus: { type: "string", enum: DesignStatus.listr() },
    photographyStatus: { type: "string", enum: PhotographyStatus.listr() },
    authors: { type: "array", items: UserPublicResponse.schema }, // Authors are not required
    editors: { type: "array", items: UserPublicResponse.schema }, // Editors are not required
    designers: { type: "array", items: UserPublicResponse.schema }, // Designers are not required
    photographers: { type: "array", items: UserPublicResponse.schema }, // Photographers are not required
    approvingUser: { type: UserPublicResponse.schema }, // Approving user is not required
    approvalTime: { type: "string", format: "date-time" },
    creationTime: { type: "string", format: "date-time", required: true },
    modificationTime: { type: "string", format: "date-time", required: true },
  },
  required: [
    "title",
    "slug",
    "categories",
    "articleContent",
    "pageLength",
    "articleStatus",
    "writingStatus",
    "designStatus",
    "photographyStatus",
    "creationTime",
    "modificationTime",
  ],
  additionalProperties: false,
};
