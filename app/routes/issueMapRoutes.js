import express from "express";
import bodyParser from "body-parser";

const router = express.Router();

router.use(bodyParser.urlencoded({ extended: false }));

router.route("/create"); //create an issue map
router.route("issue-map/section-data"); // create a route for updating section-data. 

export default router;
