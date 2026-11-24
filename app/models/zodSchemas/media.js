import * as z from "zod";
import MediaFolder from "../enums/mediaFolder.js";

/* Schematics for requesting presigned media upload URLs */

export const UploadUrlRequest = z.object({
  folder: z.enum(MediaFolder.listr()),
  contentType: z.string(),
  size: z.number().int().positive(), // bytes, checked against the folder's max size
});

export const DownloadUrlRequest = z.object({
  key: z.string(), // an S3 key returned from POST /media/upload-url
});
