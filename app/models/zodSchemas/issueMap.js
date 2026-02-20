import * as z from "zod";
import { UserPublicResponse } from "./user";
import { ArticlePublicResponse } from "./article";

export const IssueMap = z.object({
    issueNumber: z.number(),
    issueName: z.string(),
    sections: z.array().default([]), // array of what
    articles: z.array().optional(),
    pages: z.number(),
    creatingUser: z.string(), // will this ever map to something else like a fk
    creationTime: z.date().default(new Date()),
    modificationTime: z.date().default(new Date())
});

export const IssueMapResponse = IssueMap.extend({
    sections: z.array(z.object({
        sectionName: z.string(),
        color: z.string(),
        creatingUser: UserPublicResponse,
        articles: ArticlePublicResponse.default([]), // is this supposed to be an array of articleresponses?
        creationTime: z.date(),
        modificationTime: z.date()
    })),
    articles: ArticlePublicResponse.default([]),
    creatingUser: UserPublicResponse,
    creationTime: z.date(),
    modificationTime: z.date()
});

export const IssueMapUpdate = z.object({
    issueNumber: z.number(),
    issueName: z.string(),
    sections: z.array(z.object({
        sectionName: z.string(),
        color: z.string(),
        articles: z.array(),
        modificationTime: z.date(),
    })),
    articles: z.array(),
    pages: z.number(),
    modificationTime: z.date().default(new Date())
}).partial();

export const IssueMapDelete = z.object({
    issueNumber: z.number(),
    issueName: z.string()
});