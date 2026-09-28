import CommentStatus from "../enums/commentStatus.js";
import { BaseModel, string, date, now, object } from "./baseModel.js";

export class InternalCommentCreate extends BaseModel {
  static schema = {
    user: { type: object, required: true },
    comment: { type: string, required: true },
    commentStatus: { type: string, default: CommentStatus.Unresolved.toString(), override: true },
    creationTime: { type: date, default: now, override: true },
    modificationTime: { type: date, default: now, override: true },
  };
  constructor(json) {
    super(json, InternalCommentCreate.schema);
  }
}
