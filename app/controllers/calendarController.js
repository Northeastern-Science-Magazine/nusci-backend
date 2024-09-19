import CalendarEventResponse from "../models/apiModels/calendarEvent.js"
import CalendarEventAccessor from "../databaseAccessors/calendarAccessor.js";
import CalendarEvent from "../models/dbModels/calendarEvent.js";
import Authorize from "../auth/authorization.js"
/**
 * CalendarController Class
 *
 * This class controls the behaviour of any web request
 * related to Calendar Events.
 */
export default class CalendarController {
    /**
     * get CalendarEvents within a specific time range, after a certain date, or before a certain date
     * @param {HTTP REQ} req req
     * @param {HTTP RES} res res    
     */
    static async getCalendarEvent(req, res) {
        const { before, after } = req.body;
        let events;

        if (before > after) {
            throw ErrorInternalAPIModelFieldValidation("Invalid date input. Before date is after After date.");
        }

        let start;
        let end;

        // if before or after is not given, query the database for the earliest/latest event
        if (before && !after) {
            end = new Date(before);
            start = await CalendarEvent.find().sort({ startTime: -1 });
            events = await CalendarEventAccessor.getEventsByStartTimeRange(start, end);
        } else if (after && !before) {
            start = new Date(after);
            end = await CalendarEvent.find().sort({ startTime: -1 });
            events = await CalendarEventAccessor.getEventsByEndTimeRange(start, end);
        } else if (before && after) {
            start = new Date(after);
            end = new Date(before);
            events = await CalendarEventAccessor.getEventsByStartTimeRange(start, end);
            events.push(...await CalendarEventAccessor.getEventsByEndTimeRange(start, end));
        } else {
            events = await CalendarEventAccessor.getAllEvents();
        }
        // getRoles()

        // filter the events to show only the authorized events
        // find the role of the currenly signed in user

        //const filtered = events.filter(event => event.visibleToRoles === Authorize.getRoles(req.cookies));
        const filteredCalendarEvent = new CalendarEventResponse(events);
        res.status(202).json(filteredCalendarEvent);
    } catch(e) {
        console.error(e);
        throw ErrorInternalAPIModelFieldValidation(e);
    }
}
