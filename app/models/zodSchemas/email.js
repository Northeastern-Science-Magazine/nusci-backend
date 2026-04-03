import * as z from "zod";
import EmailType from "../enums/emailType.js";

/* Schematics for email templates. Should match the resend templates (todo) */

export const BaseEmail = z.object({
  type: z.enum(EmailType.listr()), // used to determine which template to assign
  to: z.array(z.email()), //one user or multiple
});

export const ReminderEmail = BaseEmail.extend({
  type: z.literal(EmailType.Reminder.toString()),
  reminderTitle: z.string(), // i.e: reminder: fill out form
  reminderDate: z.string().optional(), // i.e: reminder: fill out form **by date**
});

export const ResetPasswordEmail = BaseEmail.extend({
  type: z.literal(EmailType.Reset_Password.toString()),
  resetUrl: z.string(),
});

export const DeadlineEmail = BaseEmail.extend({
  type: z.literal(EmailType.Deadline.toString()),
  action: z.string(), // ex: *Fill out form* by *deadline*
  deadline: z.string(),
  actionUrl: z.string().optional(), // ex: <link href="actionurl"> fill out form </link>
});

export const InviteUserEmail = BaseEmail.extend({
  type: z.literal(EmailType.Invite_User.toString()),
  inviteUrl: z.string(),
});

// in the case of custom emails, should the custom html (if there is any) come from the frontend?
export const CustomEmail = BaseEmail.extend({
  type: z.literal(EmailType.Custom.toString()),
  customBody: z.string(),
});

// in the case of custom emails, should the custom html (if there is any) come from the frontend?
export const OTPEmail = BaseEmail.extend({
  type: z.literal(EmailType.OTP.toString()),
});
