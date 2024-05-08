import mongoose from "mongoose";
import Accounts from "../models/enums/accounts.js";

const Schema = mongoose.Schema;

//calendar event schema
const CalendarEventSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    location: { type: String },
    public: { type: Boolean, required: true, default: false },
    // visibleToRoles: { type: [String], enum: Accounts.listStr, required: true },
    // associatedWithRoles: { type: [String], enum: Accounts.listStr },
    creatingUser: { type: Schema.Types.ObjectId, required: true },
    creationTime: { type: Date, required: true },
    modificationTime: { type: Date, required: true },
  },
  {
    //saved to the collection "calendar_event"
    collection: "calendar_event",
  }
);

const db = mongoose.connection.useDb("calendar_event");
const CalendarEvent = db.model("CalendarEvent", CalendarEventSchema);

export default CalendarEvent;
