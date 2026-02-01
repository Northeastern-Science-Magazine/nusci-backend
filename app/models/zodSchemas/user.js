import z from "zod";

export const Login = z.object({
  email: z.email(),
  password: z.string(),
});

export const Signup = z.object({});
// Validate.incoming(
//         req.body,
//         {
//           firstName: { type: string, required: true },
//           lastName: { type: string, required: true },
//           password: { type: string, required: true },
//           pronouns: { type: array, items: { type: string } },
//           graduationYear: { type: integer, required: true },
//           major: { type: string },
//           location: { type: string },
//           profileImage: { type: string },
//           bannerImage: { type: string },
//           bio: { type: string, required: true },
//           email: { type: string, required: true },
//           phone: { type: string },
//           roles: { type: array, items: { enum: Accounts.listr(), required: true } },
//           status: { enum: AccountStatus.listr(), required: true },
//           approvingUser: { const: undefined },
//           gameData: { const: undefined },
//           creationTime: { type: date, required: true },
//           modificationTime: { type: date, required: true },
//         },
//         { override: ["creationTime", "modificationTime"] }
//       );
