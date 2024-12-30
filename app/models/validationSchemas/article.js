import { array, date, string, integer, object } from "./schemaTypes.js";
import Category from "../enums/categories";
import ArticleContent from "../enums/articleContent.js";
import CommentStatus from "../enums/commentStatus.js";
import ArticleStatus from "../enums/articleStatus.js";
import WritingStatus from "../enums/writingStatus.js";
import DesignStatus from "../enums/designStatus.js";
import PhotographyStatus from "../enums/photographyStatus.js";

const articleProps = {
  title: { type: string, required: true },
  slug: { type: string, required: true },
  issueNumber: { type: integer },
  categories: { type: array, items: { type: string, enum: Category.listr(), required: true } },
  articleContent: {
    type: array,
    items: {
      type: object,
      properties: {
        contentType: { type: string, enum: ArticleContent.listr(), required: true },
        content: { type: string, required: true },
      },
    },
  },
  sources: { type: array, items: { type: string } },
  link: { type: string },
  pageLength: { type: integer, required: true },
  comments: {
    type: array,
    items: {
      type: object,
      properties: {
        user: { $ref: "/user/public/response", required: true },
        comment: { type: string, required: true },
        commentStatus: { type: string, enum: CommentStatus.listr(), required: true },
        creationTime: { type: date, required: true },
        modificationTime: { type: date, required: true },
      },
    },
  },
  articleStatus: { type: string, enum: ArticleStatus.listr(), required: true },
  writingStatus: { type: string, enum: WritingStatus.listr(), required: true },
  designStatus: { type: string, enum: DesignStatus.listr(), required: true },
  photographyStatus: { type: string, enum: PhotographyStatus.listr(), required: true },
  authors: { type: array, items: { $ref: "/user/public/response" } },
  editors: [{ type: Schema.Types.ObjectId, ref: User }],
  designers: [{ type: Schema.Types.ObjectId, ref: User }],
  photographers: [{ type: Schema.Types.ObjectId, ref: User }],
  approvingUser: { type: Schema.Types.ObjectId, ref: User },
  approvalTime: { type: date },
  creationTime: { type: date, required: true },
  modificationTime: { type: date, required: true },
};

export default articleResponse = {};
