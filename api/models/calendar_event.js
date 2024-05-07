import { ObjectId } from "mongodb";
import mongoose from "mongoose";
import Accounts from "../auth/accounts";

const Schema = mongoose.Schema;

//calendar event schema
const CalendarEventSchema = new Schema(
  {
    ObjectId: { type: ObjectId, required: true, unique: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    subject: { type: String, required: true },
    description: { type: String },
    location: { type: String },
    public: { type: Boolean, required: true, default: false },
    visibleToRoles: {
      type: [String],
      enum: [
        Accounts.None.role,
        Accounts.Author.role,
        Accounts.Editor.role,
        Accounts.Photographer.role,
        Accounts.Developer.role,
        Accounts.Admin.role,
      ],
      required: true,
    },
    associatedWithRoles: {
      type: [String],
      enum: [
        Accounts.None.role,
        Accounts.Author.role,
        Accounts.Editor.role,
        Accounts.Photographer.role,
        Accounts.Developer.role,
        Accounts.Admin.role,
      ],
    },
    creatingUser: { type: ObjectId, required: true },
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
