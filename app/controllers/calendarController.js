import CalendarEventResponse from "../models/apiModels/calendarEvent.js"
import CalendarEventAccessor from "../databaseAccessors/calendarAccessor.js";
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
     * @param {*} req request object
     * @param {*} res response object
     */
    static async getCalendarEvent(req, res) {
        const { before, after } = req.body;
        let events;

        if (before > after) {
            throw ErrorInternalAPIModelFieldValidation("Invalid date input. Before date is after After date.");
        }

        // the starting date is set to 0 if not specified.
        // the ending date is set to the current date if not specified.
        let start = new Date(0);
        let end = new Date().getDate();

        if (before && !after) {
            end = new Date(before);
            events = await CalendarEventAccessor.getEventsByStartTimeRange(start, end);
        } else if (after && !before) {
            start = new Date(after);
            events = await CalendarEventAccessor.getEventsByEndTimeRange(start, end);
        } else if (before && after) {
            start = new Date(after);
            end = new Date(before);
            events = await CalendarEventAccessor.getEventsByStartTimeRange(start, end);
            events.push(...await CalendarEventAccessor.getEventsByEndTimeRange(start, end));
        } else {
            events = await CalendarEventAccessor.getAllEvents();
        }

        // filter the events to show only the authorized events
        const filtered = events.filter(event => event.visibleToRoles === Authorize.getRoles());
        res.status(202).json(filtered);
    } catch(e) {
        console.error(e);
        throw ErrorInternalAPIModelFieldValidation(e);
    }
}
