import * as z from "zod";

/* Schematics for archived (print) issues */

export const ArchivedIssueCreate = z.object({
  issueNumber: z.number().int().positive(),
  title: z.string().trim().min(1),
  pdfKey: z.string(), // key returned from POST /media/upload-url, the cover is rendered from it
});

export const ArchivedIssueResponse = z.object({
  issueNumber: z.number(),
  title: z.string(),
  pdfUrl: z.string(), // presigned, expires
  coverUrl: z.string(), // presigned, expires
});
