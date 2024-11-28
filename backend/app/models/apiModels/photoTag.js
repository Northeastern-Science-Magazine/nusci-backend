import { BaseModel, string, date, now } from "./base_model.js";
import { UserPublicResponse } from "./user.js";

export class PhotoTagCreate extends BaseModel {
  static schema = {
    tagName: { type: string, required: true },
    color: { type: string, required: true },
    creatingUser: { type: string, required: true },
    creationTime: { type: date, default: now, override: true },
    modificationTime: { type: date, default: now, override: true },
  };
  constructor(json) {
    super(json, PhotoTagCreate.schema);
  }
}

export class PhotoTagResponse extends BaseModel {
  static schema = {
    tagName: { type: string, unique: true, required: true },
    color: { type: string, required: true },
    creatingUser: { type: UserPublicResponse.schema, required: true },
    creationTime: { type: date, required: true },
    modificationTime: { type: date, required: true },
  };

  constructor(json) {
    super(json, PhotoTagResponse.schema);
  }
}

export class PhotoTagUpdate extends BaseModel {
  static schema = {
    tagName: { type: string },
    color: { type: string },
    modificationTime: { type: Date, default: now, override: true },
  };
  constructor(json) {
    super(json, PhotoTagUpdate.schema);
  }
}

export class PhotoTagDelete extends BaseModel {
  static schema = {
    tagName: { type: string, required: true },
  };
  constructor(json) {
    super(json, PhotoTagDelete.schema);
  }
}
