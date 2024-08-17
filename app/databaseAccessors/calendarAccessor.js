import CalendarEvent from "../models/dbModels/calendarEvent.js";
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
    await Connection.open();
    const events = await CalendarEvent.find({});
    return events;
  }

  /**
   * Find event by its ID
   *
   * @param {ObjectID} eventID - The ID of the event
   * @returns Calendar event
   */
  static async getEventByID(eventID) {
    await Connection.open();
    const event = await CalendarEvent.findById(new mongoose.Types.ObjectId(eventID));
    return event;
  }

  /**
   * Find and return calendar event by title
   *
   * @param {String} title - The title of the event
   * @returns event
   */
  static async getEventByTitle(title) {
    await Connection.open();
    const event = await CalendarEvent.findOne({ title: title });
    return event;
  }

  /**
   * Find events that start within the provided time range
   *
   * @param {Date} start - Start time range
   * @param {Date} end - End time range
   * @returns calendar events
   */
  static async getEventsByStartTimeRange(start, end) {
    await Connection.open();
    const events = await CalendarEvent.find({ startTime: { $gte: start, $lte: end } });
    return events;
  }

  /**
   * Find events that end within the provided time range
   *
   * @param {Date} start - Start time range
   * @param {Date} end - End time range
   * @returns events
   */
  static async getEventsByEndTimeRange(start, end) {
    await Connection.open();
    const events = await CalendarEvent.find({ endTime: { $gte: start, $lte: end } });
    return events;
  }

  /**
   * Find events by location
   *
   * @param {String} location - The location of the event
   * @returns events
   */
  static async getEventsByLocation(location) {
    await Connection.open();
    const events = await CalendarEvent.find({ location: location });
    return events;
  }

  /**
   * Get all public events
   *
   * @returns public events
   */
  static async getPublicEvents() {
    await Connection.open();
    const events = await CalendarEvent.find({ public: true });
    return events;
  }

  /**
   * Get all private events
   *
   * @returns private events
   */
  static async getPrivateEvents() {
    await Connection.open();
    const events = await CalendarEvent.find({ public: false });
    return events;
  }

  /**
   * Get events visible to a specific role
   *
   * @param {String} role - The role for which events are visible
   * @returns events
   */
  static async getEventsByVisibleToRole(role) {
    await Connection.open();
    const events = await CalendarEvent.find({ visibleToRoles: { $in: [role] } });
    return events;
  }

  /**
   * Get events associated with a specific role
   *
   * @param {String} role - The role with which events are associated
   * @returns events
   */
  static async getEventsByAssociatedWithRole(role) {
    await Connection.open();
    const events = await CalendarEvent.find({ associatedWithRoles: { $in: [role] } });
    return events;
  }

  /**
   * Get events created by a specific user
   *
   * @param {String} userID - The ID of the user who created the events
   * @returns events
   */
  static async getEventsByCreatingUser(userID) {
    await Connection.open();
    const events = await CalendarEvent.find({ creatingUser: new mongoose.Types.ObjectId(userID) });
    return events;
  }
}
