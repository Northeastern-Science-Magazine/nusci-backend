import * as z from "zod";
import { UserPublicResponse } from "./user.js";
import { PhotoTagResponse } from "./photoTag.js";

export const Photo = z.object({
    url: z.string(),
    tags: z.array(z.string()).nullish(),
    photographers: z.array(z.string()).nullish(),
    photoTime: z.date().default(new Date()).nullish(),
    rights: z.string().default(""),
    creationTime: z.date().default(new Date()),
    modificationTime : z.date().default(new Date())
});

export const PhotoResponse = Photo.extend({
    tags: z.array(PhotoTagResponse),
    photographers: z.array(UserPublicResponse)
});

export const PhotoUpdate = z.object({
    tags: z.array(z.string()),
    photographers: z.array(z.string()),
    photoTime: z.date(),
    rights: z.string(),
    modificationTime: z.date().default(new Date())
}).partial();

export const PhotoDelete = z.object({
    url: z.string()
});