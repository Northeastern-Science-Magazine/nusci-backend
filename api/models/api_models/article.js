import { UserPublicResponse } from "../../models/api_models/user.js";
import ArticleContent from "../enums/article_content.js";
import ArticleStatus from "../enums/article_status.js";
import Category from "../enums/categories.js";
import DesignStatus from "../enums/design_status.js";
import PhotographyStatus from "../enums/photography_status.js";
import WritingStatus from "../enums/writing_status.js";
import { BaseModel, BaseModelUpdate, array, number, string, now } from "./base_model.js";

export class ArticleCreate extends BaseModel {
  static schema = {
    title: { type: string, required: true },
    slug: { type: string, required: true },
    issueNumber: { type: number },
    categories: { type: [string], enum: Category.listr(), required: true },
    articleContent: { type: array, default: [], override: true },
    sources: { type: [string] },
    link: { type: string },
    pageLength: { type: number, required: true },
    comments: { type: array, default: [], override: true },
    articleStatus: { type: string, enum: ArticleStatus.listr(), required: true },
    articleStatus: { type: string, enum: WritingStatus.listr(), required: true },
    designStatus: { type: string, enum: DesignStatus.listr(), required: true },
    photographyStatus: { type: string, enum: PhotographyStatus.listr(), required: true },
    authors: { type: [string] },
    editors: { type: [string] },
    designers: { type: [string] },
    photographers: { type: [string] },
  };
  constructor(json) {
    super(json, ArticleCreate.schema);
  }
}

export class ArticleResponse extends BaseModel {
  static schema = {
    title: { type: string, required: true },
    slug: { type: string, required: true },
    issueNumber: { type: number },
    categories: { type: [string], enum: Category.listr(), required: true },
    articleContent: {
      type: [
        {
          contentType: { type: string, enum: ArticleContent.listr(), required: true },
          content: { type: string, required: true },
        },
      ],
    },
    sources: { type: [string] },
    link: { type: string },
    pageLength: { type: number, required: true },
    comments: {
      type: [
        {
          user: { type: UserPublicResponse.schema },
          comment: { type: string, required: true },
          commentStatus: { type: string, enum: CommentStatus.listr(), required: true },
          creationTime: { type: date, required: true },
          modificationTime: { type: date, required: true },
        },
      ],
    },
    articleStatus: { type: string, enum: ArticleStatus.listr(), required: true },
    articleStatus: { type: string, enum: WritingStatus.listr(), required: true },
    designStatus: { type: string, enum: DesignStatus.listr(), required: true },
    photographyStatus: { type: string, enum: PhotographyStatus.listr(), required: true },
    authors: { type: [UserPublicResponse.schema] },
    editors: { type: [UserPublicResponse.schema] },
    designers: { type: [UserPublicResponse.schema] },
    photographers: { type: [UserPublicResponse.schema] },
    approvingUser: { type: UserPublicResponse.schema },
    approvalTime: { type: date },
    creationTime: { type: date, required: true },
    modificationTime: { type: date, required: true },
  };
  constructor(json) {
    super(json, ArticleResponse.schema);
  }
}

export class ArticlePublicResponse extends BaseModel {
  static schema = {
    title: { type: string, required: true },
    slug: { type: string, required: true },
    issueNumber: { type: number },
    categories: { type: [string], enum: Category.listr(), required: true },
    articleContent: {
      type: [
        {
          contentType: { type: string, enum: ArticleContent.listr(), required: true },
          content: { type: string, required: true },
        },
      ],
    },
    sources: { type: [string] },
    pageLength: { type: number, required: true },
    comments: {
      type: [
        {
          user: { type: UserPublicResponse.schema },
          comment: { type: string, required: true },
          commentStatus: { type: string, enum: CommentStatus.listr(), required: true },
          creationTime: { type: date, required: true },
          modificationTime: { type: date, required: true },
        },
      ],
    },
    authors: { type: [UserPublicResponse.schema] },
    editors: { type: [UserPublicResponse.schema] },
    designers: { type: [UserPublicResponse.schema] },
    photographers: { type: [UserPublicResponse.schema] },
    approvingUser: { type: UserPublicResponse.schema },
    approvalTime: { type: date },
    creationTime: { type: date, required: true },
    modificationTime: { type: date, required: true },
  };
  constructor(json) {
    super(json, ArticlePublicResponse.schema);
  }
}

export class ArticleUpdate extends BaseModelUpdate {
  static schema = {
    title: { type: string },
    slug: { type: string },
    issueNumber: { type: number },
    categories: { type: [string], enum: Category.listr() },
    articleContent: {
      type: [
        {
          contentType: { type: string, enum: ArticleContent.listr() },
          content: { type: string },
        },
      ],
    },
    sources: { type: [string] },
    pageLength: { type: number },
    comments: {
      type: [
        {
          user: { type: UserPublicResponse.schema },
          comment: { type: string },
          commentStatus: { type: string, enum: CommentStatus.listr() },
          creationTime: { type: date },
          modificationTime: { type: date },
        },
      ],
    },
    authors: { type: [UserPublicResponse.schema] },
    editors: { type: [UserPublicResponse.schema] },
    designers: { type: [UserPublicResponse.schema] },
    photographers: { type: [UserPublicResponse.schema] },
    approvingUser: { type: UserPublicResponse.schema },
    approvalTime: { type: date },
    modificationTime: { type: date, default: now, override: true },
  };
  constructor(json) {
    super(json, ArticleUpdate.schema);
  }
}

export class ArticleDelete extends BaseModel {
  static schema = {
    slug: { type: string, required: true },
  };
  constructor(json) {
    super(json, ArticleDelete.schema);
  }
}
