import * as z from "zod";
import Category from "../enums/categories";
import ArticleContent from "../enums/articleContent";
import { UserPublicResponse } from "./user";
import CommentStatus from "../enums/commentStatus";
import PhotographyStatus from "../enums/photographyStatus";
import ArticleStatus from "../enums/articleStatus";
import WritingStatus from "../enums/writingStatus";
import DesignStatus from "../enums/designStatus";

export const Article = z.object({
  title: z.string(),
  slug: z.string(),
  issueNumber: z.number().optional(),
  categories: z.array(z.enum(Category)),
  sources: z.array(z.string()).optional(),
  link: z.string().optional(),
  pageLength: z.number(),
  comments: z.array(
    z
      .object({
        user: UserPublicResponse.optional(),
        comment: z.string(),
        commentStatus: z.enum(CommentStatus),
        creationTime: z.date(),
        modificationTime: z.date(),
      })
      .default([])
  ),
  articleStatus: z.enum(ArticleStatus),
  writingStatus: z.enum(WritingStatus),
  designStatus: z.enum(DesignStatus),
  photographyStatus: z.enum(PhotographyStatus),
  authors: z.array(z.email()).optional(),
  editors: z.array(z.email()).optional(),
  designers: z.array(z.email()).optional(),
  photographers: z.array(z.email()).optional(),
});

export const ArticleResponse = Article.extend({
  articleContent: z
    .array(
      z.object({
        contentType: z.enum(ArticleContent),
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

export const ArticlePublicResponse = Article.extend({
  articleContent: z
    .array(
      z.object({
        contentType: z.enum(ArticleContent),
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
