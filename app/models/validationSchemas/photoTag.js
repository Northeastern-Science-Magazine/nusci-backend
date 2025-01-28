import { string, date, array, integer, object } from "./schemaTypes.js";
import { userPublicResponse } from "./user.js";

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
