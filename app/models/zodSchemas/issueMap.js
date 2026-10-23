import * as z from "zod";
import { UserPublicResponse } from "./user.js";

export const IssueMap = z.object({
  issueNumber: z.number(),
  issueName: z.string(),
  sections: z.array(z.any()).default([]), // array of what
  articles: z.array(z.string()).nullish(),
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
      articles: z.array(z.string()).default([]),
      creationTime: z.date(),
      modificationTime: z.date(),
    })
  ),
  articles: z.array(z.string()).default([]),
  creatingUser: UserPublicResponse,
  creationTime: z.date(),
  modificationTime: z.date(),
});

const IssueMapFields = z.object({
  issueNumber: z.number().int().positive(),
  issueName: z.string().trim().min(1),
  pages: z.number().int().nonnegative(),
});

export const IssueMapCreate = IssueMapFields.extend({
  sections: z
    .array(
      z.object({
        sectionName: z.string().trim().min(1),
        sectionColor: z.string().trim().min(1),
      })
    )
    .default([])
    .refine((sections) => new Set(sections.map((s) => s.sectionName)).size === sections.length, {
      message: "Section names must be unique within an issue.",
    }),
});

export const IssueMapUpdate = IssueMapFields.partial().refine((update) => Object.keys(update).length > 0, {
  message: "At least one field must be updated.",
});

export const IssueMapDelete = z.object({
  issueNumber: z.number(),
  issueName: z.string(),
});
