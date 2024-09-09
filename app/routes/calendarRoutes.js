import express from "express";
import bodyParser from "body-parser";
import CalendarController from "../controllers/calendarController";

const router = express.Router();

router.use(bodyParser.urlencoded({ extended: false }));

router.get("/calendar", CalendarController.getCalendarEvent);

export default router;
