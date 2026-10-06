import * as z from "zod";

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
