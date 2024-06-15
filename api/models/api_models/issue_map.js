import { BaseModel, BaseModelUpdate, number, string, date, object } from "./base_model.js";
import { UserPublicResponse } from "./user.js";

/**
 * Represents the http request body required
 * to create a issue map in the database.
 */
export class IssueMapCreate extends BaseModel {
  static schema = {
    issueNumber: { type: number, required: true },
    issueName: { type: string, required: true },
    /**
     * @TODO
     * change to array
     **/
    sections: { type: object, default: [], override: true },
    /**
     * @TODO
     * change to array
     */
    articles: { type: object, default: [] },
    pages: { type: number, required: true },
    creatingUser: { type: string, required: true },
    creationTime: { type: date, default: Date.now(), override: true },
    modificationTime: { type: date, default: Date.now(), override: true },
  };

  constructor() {
    try {
      super(json, IssueMapCreate.schema);
    } catch (e) {
      throw new ErrorInternalAPIModelValidation(e.message);
    }
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
          sectionName: { type: "string", required: true },
          color: { type: "string", required: true },
          creatingUser: { type: UserPublicResponse.schema, required: true },
          /**
           * @todo
           * update articles
           */
          articles: { type: object, default: [] },
          creationTime: { type: "date", required: true },
          modificationTime: { type: "date", required: true },
        },
      ],
    },
    /**
     * @todo
     * update articles
     */
    articles: { type: object, default: [] },
    pages: { type: number, required: true },
    creatingUser: { type: UserPublicResponse.schema, required: true },
    creationTime: { type: date, required: true },
    modificationTime: { type: date, required: true },
  };

  constructor() {
    try {
      super(json, IssueMapResponse.schema);
    } catch (e) {
      throw new ErrorInternalAPIModelValidation(e.message);
    }
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
          sectionName: { type: "string" },
          color: { type: "string" },
          articles: { type: object, default: [] },
          modificationTime: { type: "date" },
        },
      ],
    },
    articles: { type: object, default: [] },
    pages: { type: number },
    modificationTime: { type: date },
  };

  constructor() {
    try {
      super(json, IssueMapUpdate.schema);
    } catch (e) {
      throw new ErrorInternalAPIModelValidation(e.message);
    }
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
    try {
      super(json, IssueMapDelete.schema);
    } catch (e) {
      throw new ErrorInternalAPIModelValidation(e.message);
    }
  }
}
