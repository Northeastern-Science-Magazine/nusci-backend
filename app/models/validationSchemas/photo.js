import { string, date, array, integer, object } from "./schemaTypes.js";
import { userPublicResponse } from "./user.js";
import { photoTagPublicResponse } from "./temp_phototag.js"

const commonPhotoProperties = {
  url: { type: string, required: true },
  tags: { type: array, items: { type: string } },
  photographers: { type: array, items: { type: string } },
  photoTime: { type: date, required: true, default: new Date() },
  rights: { type: string, required: true, default: "" },
  creationTime: { type: date, required: true },
  modificationTime: { type: date, required: true },
};

/**
 * Represents the http request body required
 * to create a photo in the database.
 */
export const photoCreate = {
  type: object,
  id: "/photo/create",
  properties: { ...commonPhotoProperties },
};

/**
 * Represents the http response body returned to a frontend with no private data.
 */
export const photoResponse = {
  type: object,
  id: "/photo/response",
  properties: { ...commonPhotoProperties },
};


/**
 * Represents the http response body returned to a frontend with no private data.
 */
export const photoPublicResponse = {
  type: object,
  id: "/photo/public/response",
  properties: { 
    ...commonPhotoProperties,
    photographers: {
      type: array, 
      items: userPublicResponse, 
    },
    tags: {
      type: array, 
      items: photoTagPublicResponse, 
    },
   },
};

