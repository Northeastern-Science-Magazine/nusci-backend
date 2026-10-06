import * as z from "zod";
import mongoose from "mongoose";
import Category from "../enums/categories.js";
import ArticleContent from "../enums/articleContent.js";
import { UserPublicResponse } from "./user.js";
import CommentStatus from "../enums/commentStatus.js";
import PhotographyStatus from "../enums/photographyStatus.js";
import ArticleStatus from "../enums/articleStatus.js";
import WritingStatus from "../enums/writingStatus.js";
import DesignStatus from "../enums/designStatus.js";

// Mongoose returns an unpopulated ref as an ObjectId instance, not a string;
// only a populated ref is a full UserPublicResponse-shaped object.
const UserRefOrPublicResponse = z.union([z.string(), z.instanceof(mongoose.Types.ObjectId), UserPublicResponse]);

export const Article = z.object({
  title: z.string(),
  slug: z.string(),
  issueNumber: z.number().nullish(),
  categories: z.array(z.enum(Category.listr())),
  articleContent: z.array(
    z.array(
      z.object({
        contentType: z.enum(ArticleContent.listr()),
        content: z.string(),
        href: z.string().nullish(),
      })
    )
  ),
  sources: z
    .array(
      z.object({
        text: z.string(),
        href: z.string().nullable(),
      })
    )
    .nullish(),
  link: z.string().nullish(),
  pageLength: z.number(),
  comments: z.array(
    z
      .object({
        user: UserRefOrPublicResponse.nullish(),
        comment: z.string(),
        commentStatus: z.enum(CommentStatus.listr()),
        creationTime: z.date(),
        modificationTime: z.date(),
      })
      .default([])
  ),
  articleStatus: z.enum(ArticleStatus.listr()),
  writingStatus: z.enum(WritingStatus.listr()),
  designStatus: z.enum(DesignStatus.listr()),
  photographyStatus: z.enum(PhotographyStatus.listr()),
  authors: z.array(z.string()).nullish(),
  editors: z.array(z.email()).nullish(),
  designers: z.array(z.email()).nullish(),
  photographers: z.array(z.email()).nullish(),
});

export const ArticleResponse = Article.extend({
  authors: z.array(UserRefOrPublicResponse).nullish(),
  editors: z.array(UserRefOrPublicResponse).nullish(),
  designers: z.array(UserRefOrPublicResponse).nullish(),
  photographers: z.array(UserRefOrPublicResponse).nullish(),
  approvingUser: UserRefOrPublicResponse.nullish(),
  approvalTime: z.date().nullish(),
  creationTime: z.date(),
  modificationTime: z.date(),
});

export const ArticlePublicResponse = Article.extend({
  authors: z.array(UserRefOrPublicResponse).nullish(),
  editors: z.array(UserRefOrPublicResponse).nullish(),
  designers: z.array(UserRefOrPublicResponse).nullish(),
  photographers: z.array(UserRefOrPublicResponse).nullish(),
  approvingUser: UserRefOrPublicResponse.nullish(),
}).omit({
  link: true,
});

export const ArticlePublicListResponse = z.array(ArticlePublicResponse);

export const ArticleUpdate = Article.extend({
  modificationTime: z.date().default(new Date()),
})
  .omit({
    link: true,
  })
  .partial();

export const ArticleDelete = z.object({
  slug: z.string(),
});

export const ArticleSearchRequest = z.object({
  limit: z.number().int().nonnegative().nullish(),
  skip: z.number().int().nonnegative().default(0),
  textQuery: z.string().nullish(),
  categories: z.array(z.enum(Category.listr())).nullish(),
  sortBy: z.enum(["asc", "desc"]).default("desc"),
});
