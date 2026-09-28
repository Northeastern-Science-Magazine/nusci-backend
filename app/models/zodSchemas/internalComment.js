import * as z from "zod";
import CommentStatus from "../enums/commentStatus.js";

export const InternalComment = z.object({
    user: z.any(), // server-computed Mongoose ObjectId, not client input
    comment: z.string(),
    commentStatus: z.enum(CommentStatus.listr()).default(CommentStatus.Unresolved.toString()),
    creationTime: z.date().default(new Date()),
    modificationTime: z.date().default(new Date())
})

export const InternalCommentResolve = z.object({
    commentId: z.string()
})