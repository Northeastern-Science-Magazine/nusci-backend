import * as z from "zod";
import { UserPublicResponse } from "./user.js";
import { ArticlePublicResponse } from "./article.js";

export const IssueMap = z.object({
  issueNumber: z.number(),
  issueName: z.string(),
  sections: z
    .array().default([]), // array of what
  articles: z.array().optional(),
  pages: z.number(),
  creatingUser: z.string(), // will this ever map to something else like a fk
  creationTime: z.date().default(new Date()),
  modificationTime: z.date().default(new Date()),
});

// this needs to be reviewed, for the UserPublicResponse
export const IssueMapResponse = IssueMap.extend({
  sections: z.array(
    z.object({
      sectionName: z.string(),
      color: z.string(),
      creatingUser: UserPublicResponse,
      articles: z.array().default([]),
      creationTime: z.date(),
      modificationTime: z.date(),
    })
  ),
  articles: z.array().default([]),
  creatingUser: UserPublicResponse,
  creationTime: z.date(),
  modificationTime: z.date(),
});

export const IssueMapUpdate = z
  .object({
    issueNumber: z.number(),
    issueName: z.string(),
    sections: z.array(
      z.object({
        sectionName: z.string(),
        color: z.string(),
        articles: z.array(ArticlePublicResponse),
        modificationTime: z.date(),
      })
    ),
    articles: z.array(ArticlePublicResponse),
    pages: z.number(),
    modificationTime: z.date().default(new Date()),
  })
  .partial();

export const IssueMapDelete = z.object({
  issueNumber: z.number(),
  issueName: z.string(),
});
