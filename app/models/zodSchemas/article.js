import * as z from "zod";
import Category from "../enums/categories.js";
import ArticleContent from "../enums/articleContent.js";
import { UserPublicResponse } from "./user.js";
import CommentStatus from "../enums/commentStatus.js";
import PhotographyStatus from "../enums/photographyStatus.js";
import ArticleStatus from "../enums/articleStatus.js";
import WritingStatus from "../enums/writingStatus.js";
import DesignStatus from "../enums/designStatus.js";

// to remove ambiguity from dbmodel's Article
export const ZodArticle = z.object({
  title: z.string(),
  slug: z.string(),
  issueNumber: z.number().optional(),
  categories: z.array(z.enum(Category.listr())),
  sources: z.array(z.string()).optional(),
  link: z.string().optional(),
  pageLength: z.number(),
  comments: z.array(
    z
      .object({
        user: UserPublicResponse.optional(),
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
  authors: z.array(UserPublicResponse).optional(),
  editors: z.array(UserPublicResponse).optional(),
  designers: z.array(UserPublicResponse).optional(),
  photographers: z.array(UserPublicResponse).optional(),
});

export const ArticleResponse = ZodArticle.extend({
  articleContent: z
    .array(
      z.object({
        contentType: z.enum(ArticleContent.listr()),
        content: z.string(),
      })
    )
    .optional()
    .default([]),
  authors: z.array(UserPublicResponse).optional(),
  editors: z.array(UserPublicResponse).optional(),
  designers: z.array(UserPublicResponse).optional(),
  photographers: z.array(UserPublicResponse).optional(),
  approvingUser: UserPublicResponse.optional(),
  approvalTime: z.date().optional(),
  creationTime: z.date(),
  modificationTime: z.date(),
});

export const ArticlePublicResponse = ZodArticle.extend({
  articleContent: z
    .array(
      z.object({
        contentType: z.enum(ArticleContent.listr()),
        content: z.string(),
      })
    )
    .optional()
    .default([]),
  authors: z.array(UserPublicResponse).optional(),
  editors: z.array(UserPublicResponse).optional(),
  designers: z.array(UserPublicResponse).optional(),
  photographers: z.array(UserPublicResponse).optional(),
  approvingUser: UserPublicResponse.optional(),
}).omit({
  link: true,
});

export const ArticleCreate = z.object({
  articleSlug: z.string(),
  issueNumber: z.number().refine((val) => val >= 0),
  pageLength: z.number().refine((val) => val >= 0),
  authors: z.array(z.email()).default([]),
  editors: z.array(z.email()).default([]),
  designers: z.array(z.email()).default([]),
  photographers: z.array(z.email()).default([]),
  section: z.string().default(""),
  categories: z.array(z.string(Category.listr())).default([]),
});

export const ArticleUpdate = ZodArticle.extend({
  modificationTime: z.date().default(new Date()),
})
  .omit({
    link: true,
  })
  .partial();

export const ArticleDelete = z.object({
  slug: z.string(),
});
