import { BaseModel, string, date } from "./base_model.js";
import Accounts from "../models/enums/accounts.js";
import { ErrorInternalAPIModelValidation } from "../error/internal_errors.js";
import { UserPublicResponse } from "./user.js";

/**
 * Represents the http request body required
 * to create a calendar event in the database.
 */
export class CalendarEventCreate extends BaseModel {
  static schema = {
    title: { type: string, required: true },
    description: { type: string },
    startTime: { type: date, required: true },
    endTime: { type: date, required: true },
    location: { type: string },
    public: { type: boolean, required: true, default: false },
    visibleToRoles: { type: [string], enum: Accounts.listStr, required: true },
    associatedWithRoles: { type: [string], enum: Accounts.listStr },
    creatingUser: { type: string, required: true },
    creationTime: { type: date, default: Date.now(), override: true },
    modificationTime: { type: date, default: Date.now(), override: true },
  };

  constructor() {
    try {
      super(json, CalendarEventCreate.schema);
    } catch (e) {
      throw new ErrorInternalAPIModelValidation(e.message);
    }
  }
}

/**
 * Represents the http response body returned to a frontend.
 */
export class CalendarEventResponse extends BaseModel {
  static schema = {
    title: { type: string, required: true },
    description: { type: string },
    startTime: { type: date, required: true },
    endTime: { type: date, required: true },
    location: { type: string },
    public: { type: boolean, required: true, default: false },
    visibleToRoles: { type: [string], enum: Accounts.listStr, required: true },
    associatedWithRoles: { type: [string], enum: Accounts.listStr },
    creatingUser: { type: UserPublicResponse.schema, required: true },
    creationTime: { type: date, required: true },
    modificationTime: { type: date, required: true },
  };

  constructor() {
    try {
      super(json, CalendarEventResponse.schema);
    } catch (e) {
      throw new ErrorInternalAPIModelValidation(e.message);
    }
  }
}

/**
 * Represents the http request body required to
 * update any value of a CalendarEvent's fields.
 */
export class CalendarEventUpdate extends BaseModelUpdate {
  static schema = {
    title: { type: string },
    description: { type: string },
    startTime: { type: date },
    endTime: { type: date },
    location: { type: string },
    public: { type: boolean },
    visibleToRoles: { type: [string], enum: Accounts.listStr },
    associatedWithRoles: { type: [string], enum: Accounts.listStr },
    modificationTime: { type: date, default: Date.now(), override: true },
  };

  constructor() {
    try {
      super(json, CalendarEventUpdate.schema);
    } catch (e) {
      throw new ErrorInternalAPIModelValidation(e.message);
    }
  }
}

/**
 * Represents the http request body required to delete a calendar event.
 */
export class CalendarEventDelete extends BaseModel {
  static schema = {
    title: { type: string, required: true },
    startTime: { type: date, required: true },
    endTime: { type: date, required: true },
    location: { type: string, required: true },
    creatingUser: { type: string, required: true },
  };

  constructor() {
    try {
      super(json, CalendarEventDelete.schema);
    } catch (e) {
      throw new ErrorInternalAPIModelValidation(e.message);
    }
  }
}
