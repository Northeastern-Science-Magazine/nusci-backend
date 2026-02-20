import * as z from "zod";
import CommentStatus from "../enums/commentStatus";

export const InternalComment = z.object({
    user: z.object({}), // what type is this supposed to be? type: object
    comment: z.string(),
    commentStatus: z.enum(CommentStatus.listr()).default(CommentStatus.Unresolved.toString()),
    creationTime: z.date().default(new Date()),
    modificationTime: z.date().default(new Date())
})