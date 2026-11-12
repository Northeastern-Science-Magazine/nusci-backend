import * as z from "zod";

export const PitchSubmission = z.object({
  name: z.string().trim().min(1, "Name is required.").max(200),

  email: z
    .string()
    .trim()
    .toLowerCase()
    .pipe(z.email())
    .refine((email) => email.endsWith("@northeastern.edu"), {
      message: "Please use your Northeastern email.",
    }),

  topic: z
    .string()
    .trim()
    .min(1, "Please describe your article idea.")
    .max(10000),

  draftUrl: z
    .string()
    .trim()
    .max(2048, "Your draft link is too long.")
    .pipe(
      z.union([
        z.literal(""),
        z.url({
          protocol: /^https?$/,
          message: "Please enter a valid link to your draft.",
        }),
      ])
    )
    .nullish(),
});

export const PitchSettingsUpdate = z.object({
  recipientIds: z
    .array(z.string().regex(/^[a-fA-F0-9]{24}$/, "Invalid user ID."))
    .min(1, "Please select at least one recipient."),
});