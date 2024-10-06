import { BaseModel, BaseModelUpdate, number, string, date, array, now, object } from "./baseModel.js";
import { UserPublicResponse } from "./user.js";
import { ArticlePublicResponse } from "./article.js";

/**
 * Represents the http request body required
 * to create a issue map in the database.
 */
export class IssueMapCreate extends BaseModel {
  static schema = {
    issueNumber: { type: number, required: true },
    issueName: { type: string, required: true },
    sections: { type: array, default: [], override: true },
    articles: { type: array, default: [] },
    pages: { type: number, required: true },
    creatingUser: { type: string, required: true },
    creationTime: { type: date, default: now, override: true },
    modificationTime: { type: date, default: now, override: true },
  };

  constructor() {
    super(json, IssueMapCreate.schema);
  }
}

/**
 * Represents the http response body returned to a frontend.
 */
export class IssueMapResponse extends BaseModel {
  static schema = {
    issueNumber: { type: number, required: true },
    issueName: { type: string, required: true },
    sections: {
      type: [
        {
          sectionName: { type: string, required: true },
          color: { type: string, required: true },
          creatingUser: { type: UserPublicResponse.schema, required: true },
          articles: { type: ArticlePublicResponse.schema, default: [] },
          creationTime: { type: date, required: true },
          modificationTime: { type: date, required: true },
        },
      ],
    },
    articles: { type: ArticlePublicResponse.schema, default: [] },
    pages: { type: number, required: true },
    creatingUser: { type: UserPublicResponse.schema, required: true },
    creationTime: { type: date, required: true },
    modificationTime: { type: date, required: true },
  };

  constructor(json) {
    super(json, IssueMapResponse.schema);
  }
}

/**
 * Represents the http request body required to
 * update the value of a IssueMap's fields.
 */
export class IssueMapUpdate extends BaseModelUpdate {
  static schema = {
    issueNumber: { type: number },
    issueName: { type: string },
    sections: {
      type: [
        {
          sectionName: { type: string },
          color: { type: string },
          articles: { type: [object] },
          modificationTime: { type: date },
        },
      ],
    },
    articles: { type: [object] },
    pages: { type: number },
    modificationTime: { type: date, default: now, override: true },
  };

  constructor() {
    super(json, IssueMapUpdate.schema);
  }
}

/**
 * Represents the http request body required to delete an issue.
 */
export class IssueMapDelete extends BaseModel {
  static schema = {
    issueNumber: { type: number, required: true },
    issueName: { type: string, required: true },
  };

  constructor() {
    super(json, IssueMapDelete.schema);
  }
}
