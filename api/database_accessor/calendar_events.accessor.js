import CalendarEvent from "../models/calendar_event.js";
import Connection from "../db/connection.js";
import mongoose from "mongoose";

/**
 * CalendarEvent Accessor Class
 *
 * Accesses the calendar events
 */
export default class CalendarEventAccessor {
  /**
   * get all calendar events
   *
   * @returns all calendar events
   */
  static async getAllEvents() {
    try {
      await Connection.open();
      const events = await CalendarEvent.find({});
      return events;
    } catch (e) {
      console.error(e);
      throw ErrorInternalAPIModelFieldValidation(e);
    }
  }

  /**
   * Find event by its ID
   *
   * @param {ObjectID} eventID - The ID of the event
   * @returns Calendar event
   */
  static async getEventByID(eventID) {
    try {
      await Connection.open();
      const event = await CalendarEvent.findById(new mongoose.Types.ObjectId(eventID));
      return event;
    } catch (e) {
      console.error(e);
      throw ErrorInternalAPIModelFieldValidation(e);
    }
  }

  /**
   * Find and return calendar event by title
   *
   * @param {String} title - The title of the event
   * @returns event
   */
  static async getEventByTitle(title) {
    try {
      await Connection.open();
      const event = await CalendarEvent.findOne({ title: title });
      return event;
    } catch (e) {
      console.log(e);
      throw ErrorInternalAPIModelFieldValidation(e);
    }
  }

  /**
   * Find events that start within the provided time range
   *
   * @param {Date} start - Start time range
   * @param {Date} end - End time range
   * @returns calendar events
   */
  static async getEventsByStartTimeRange(start, end) {
    try {
      await Connection.open();
      const events = await CalendarEvent.find({ startTime: { $gte: start, $lte: end } });
      return events;
    } catch (e) {
      console.error(e);
      throw ErrorInternalAPIModelFieldValidation(e);
    }
  }

  /**
   * Find events that end within the provided time range
   *
   * @param {Date} start - Start time range
   * @param {Date} end - End time range
   * @returns events
   */
  static async getEventsByEndTimeRange(start, end) {
    try {
      await Connection.open();
      const events = await CalendarEvent.find({ endTime: { $gte: start, $lte: end } });
      return events;
    } catch (e) {
      console.error(e);
      throw ErrorInternalAPIModelFieldValidation(e);
    }
  }

  /**
   * Find events by location
   *
   * @param {String} location - The location of the event
   * @returns events
   */
  static async getEventsByLocation(location) {
    try {
      await Connection.open();
      const events = await CalendarEvent.find({ location: location });
      return events;
    } catch (e) {
      console.error(e);
      throw ErrorInternalAPIModelFieldValidation(e);
    }
  }

  /**
   * Get all public events
   *
   * @returns public events
   */
  static async getPublicEvents() {
    try {
      await Connection.open();
      const events = await CalendarEvent.find({ public: true });
      return events;
    } catch (e) {
      console.error(e);
      throw ErrorInternalAPIModelFieldValidation(e);
    }
  }

  /**
   * Get all private events
   *
   * @returns private events
   */
  static async getPrivateEvents() {
    try {
      await Connection.open();
      const events = await CalendarEvent.find({ public: false });
      return events;
    } catch (e) {
      console.error(e);
      throw ErrorInternalAPIModelFieldValidation(e);
    }
  }

  /**
   * Get events visible to a specific role
   *
   * @param {String} role - The role for which events are visible
   * @returns events
   */
  static async getEventsByVisibleToRole(role) {
    try {
      await Connection.open();
      const events = await CalendarEvent.find({ visibleToRoles: { $in: [role] } });
      return events;
    } catch (e) {
      console.error(e);
      throw ErrorInternalAPIModelFieldValidation(e);
    }
  }

  /**
   * Get events associated with a specific role
   *
   * @param {String} role - The role with which events are associated
   * @returns events
   */
  static async getEventsByAssociatedWithRole(role) {
    try {
      await Connection.open();
      const events = await CalendarEvent.find({ associatedWithRoles: { $in: [role] } });
      return events;
    } catch (e) {
      console.error(e);
      throw ErrorInternalAPIModelFieldValidation(e);
    }
  }

  /**
   * Get events created by a specific user
   *
   * @param {String} userID - The ID of the user who created the events
   * @returns events
   */
  static async getEventsByCreatingUser(userID) {
    try {
      await Connection.open();
      const events = await CalendarEvent.find({ creatingUser: new mongoose.Types.ObjectId(userID) });
      return events;
    } catch (e) {
      console.error(e);
      throw ErrorInternalAPIModelValidation(e);
    }
  }
}
