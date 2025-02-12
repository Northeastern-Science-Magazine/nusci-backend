import { string, date, array, integer, object } from "./schemaTypes.js";
import { userPublicResponse } from "./user.js";

const commonPhotoTagProperties = {
  tagName: { type: string, required: true },
  color: { type: string, required: true },
  creatingUser: { type: string, required: true },
  creationTime: { type: date, required: true },
  modificationTime: { type: date, required: true },
};


/**
 * Represents the http response body returned to a frontend with no private data.
 */
export const photoTagPublicResponse = {
  type: object,
  id: "/photoTag/public/response",
  properties: { 
    ...commonPhotoTagProperties,
    creatingUser: userPublicResponse, 
   },
};

/* photo tag response */
export const photoTagResponse = {
  type: object,
  id: "/photoTag/response",
  properties: {
    tagName: { type: string, unique: true, required: true },
    color: { type: string, required: true },
    creatingUser: { type: userPublicResponse, required: true },
    creationTime: { type: date, required: true },
    modificationTime: { type: date, required: true },
  },
};
