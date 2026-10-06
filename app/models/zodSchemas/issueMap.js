import * as z from "zod";

export const IssueMapCreate = z.object({
  issueNumber: z.number().int().positive(),
  issueName: z.string().trim().min(1),
  pages: z.number().int().nonnegative(),
});

export const IssueMapUpdate = IssueMapCreate.partial().refine((update) => Object.keys(update).length > 0, {
  message: "At least one field must be updated.",
});
