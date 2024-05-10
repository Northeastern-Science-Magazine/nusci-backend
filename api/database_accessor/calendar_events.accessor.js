import CalendarEvent from "../models/calendar_event.js";
import Connection from "../db/connection.js";
import mongoose from "mongoose";

/**
 * CalendarEvent Accessor Class
 *
 * Accesses the calendar events
 */
export default class CalendarEventAccessor {
  static async getAllEvents() {
    try {
      await Connection.open();
      const events = await CalendarEvent.find({});
      return events;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  static async getEventByID(eventID) {
    try {
      await Connection.open();
      const event = await CalendarEvent.findById(new mongoose.Types.ObjectId(eventID));
      return event;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  static async getEventByTitle(title) {
    try {
      await Connection.open();
      const event = await CalendarEvent.findOne({ title: title });
      return event;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  static async getEventsByStartTimeRange(start, end) {
    try {
      await Connection.open();
      const events = await CalendarEvent.find({ startTime: { $gte: start, $lte: end } });
      return events;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  static async getEventsByEndTimeRange(start, end) {
    try {
      await Connection.open();
      const events = await CalendarEvent.find({ endTime: { $gte: start, $lte: end } });
      return events;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }


  static async getEventsByLocation(location) {
    try {
      await Connection.open();
      const events = await CalendarEvent.find({ location: location });
      return events;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  static async getPublicEvents() {
    try {
      await Connection.open();
      const events = await CalendarEvent.find({ public: true });
      return events;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  static async getPrivateEvents() {
    try {
      await Connection.open();
      const events = await CalendarEvent.find({ public: false });
      return events;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  static async getEventsByVisibleToRole(role) {
    try {
      await Connection.open();
      const events = await CalendarEvent.find({ visibleToRoles: { $in: [role] } });
      return events;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  static async getEventsByAssociatedWithRole(role) {
    try {
      await Connection.open();
      const events = await CalendarEvent.find({ associatedWithRoles: { $in: [role] } });
      return events;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  static async getEventsByCreatingUser(userID) {
    try {
      await Connection.open();
      const events = await CalendarEvent.find({ creatingUser: new mongoose.Types.ObjectId(userID) });
      return events;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
}
