import * as z from "zod";

/* Schematics for archived (print) issues */

export const ArchivedIssueCreate = z.object({
  issueNumber: z.number().int().positive(),
  title: z.string().trim().min(1),
  publicationDate: z.coerce.date(),
  pdfKey: z.string(), // key returned from POST /media/upload-url
  coverKey: z.string().optional(), // key returned from POST /media/upload-url
});

export const ArchivedIssueResponse = z.object({
  issueNumber: z.number(),
  title: z.string(),
  publicationDate: z.date(),
  pdfUrl: z.string(), // presigned, expires
  coverUrl: z.string().nullable(), // presigned, expires
});
