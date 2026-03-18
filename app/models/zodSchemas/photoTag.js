import * as z from "zod";
import { UserPublicResponse } from "./user.js";

export const PhotoTag = z.object({
    tagName: z.string(),
    color: z.string(),
    creatingUser: z.string(),
    creationTime: z.date().default(new Date()),
    modificationTime: z.date().default(new Date())
});

export const PhotoTagCreate = PhotoTag;

export const PhotoTagResponse = z.object({
    tagName: z.string(),
    color: z.string(),
    creatingUser: UserPublicResponse,
    creationTime: z.date(),
    modificationTime: z.date()
});

export const PhotoTagUpdate = z.object({
    tagName: z.string(),
    color: z.string(),
    modificationTime: z.date().default(new Date())
}).partial();

export const PhotoTagDelete = z.object({
    tagName: z.string()
});