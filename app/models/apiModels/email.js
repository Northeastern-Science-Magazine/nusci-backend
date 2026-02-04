import { BaseModel, BaseModelUpdate, array, number, string, date, now, object } from "./baseModel.js";

export class EmailCreate extends BaseModel {
  static schema = {
    // The type of email being created
    type: { type: string, required: true },
    from: { type: string, required: true },
    // max of 50
    to: { type: [string], required: true },
    subject: { type: string, required: true },
    html: { type: string, required: true },
    bcc: { type: string, required: false },
    cc: { type: string, required: false },
    id: { type: string, required: false },
  };
  constructor(json) {
    super(json, EmailCreate.schema);
  }
}
