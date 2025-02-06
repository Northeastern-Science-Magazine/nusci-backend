import { BaseModel, string, date, object, now } from "./baseModel.js";
import { UserPublicResponse } from "./user.js";
import { PhotoTagResponse } from "./photoTag.js";

const PhotoProperty = {
  url: { type: string, required: true },
  tags: { type: [string], required: true },
  photographers: { type: [string], required: true },
  photoTime: { type: date, default: now },
  rights: { type: string, required: true, default: "" },
  creationTime: { type: date, default: now, required: true },
  modificationTime: { type: date, default: now, required: true },
};

/**
 * Represents the http request body required
 * to create a photo in the database.
 */
export const PhotoCreate = {
  type: object,
  id: "/photo/create",
  properties: { ...PhotoProperty },
};

/**
 * Represents the http response body returned to a frontend with no private data.
 */
export const PhotoResponse = {
  type: object,
  id: "/photo/response",
  properties: { ...photo },
};

export class PhotoUpdate extends BaseModel {
  static schema = {
    url: { type: string },
    tags: { type: string },
    photographers: { type: string },
    photoTime: { type: date },
    rights: { type: string },
    modificationTime: { type: date, default: now, override: true },
  };

  constructor(json) {
    super(json, PhotoUpdate.schema);
  }
}

export class PhotoDelete extends BaseModel {
  static schema = {
    url: { type: String, required: true },
  };

  constructor(json) {
    super(json, PhotoDelete.schema);
  }
}
