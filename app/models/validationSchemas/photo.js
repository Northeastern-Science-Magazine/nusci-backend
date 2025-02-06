import { string, date, array, integer, object } from "./schemaTypes.js";
import { UserPublicResponse } from "./user.js";

const photoProperties = {
  url: { type: string, required: true },
  tags: { type: [string], required: true },
  photographers: { type: [string], required: true },
  photoTime: { type: date, required: true },
  rights: { type: string, required: true, default: "" },
  creationTime: { type: date, required: true },
  modificationTime: { type: date, required: true },
};

/**
 * Represents the http request body required
 * to create a photo in the database.
 */
export const PhotoCreate = {
  type: object,
  id: "/photo/create",
  properties: { ...photoProperties },
};

/**
 * Represents the http response body returned to a frontend with no private data.
 */
export const PhotoResponse = {
  type: object,
  id: "/photo/response",
  properties: { ...photoProperties },
};


