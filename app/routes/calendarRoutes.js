import express from "express";
import bodyParser from "body-parser";

const router = express.Router();

router.use(bodyParser.urlencoded({ extended: false }));

router.route("/create"); //create a one-off event
router.route("/create-recurring"); //create a recurring event

export default router;
