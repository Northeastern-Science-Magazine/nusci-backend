import express from "express";
import bodyParser from "body-parser";

const router = express.Router();

router.use(bodyParser.urlencoded({ extended: false }));

router.route("/upload"); //upload a photo

router.route("/add-tag/:url"); //add a tag to this photo (maybe do it by id?)
router.route("/filter"); //filter by tags, photographer etc
router.route("/:url"); //get a photo by its url

router.route("/photographers/:url"); //update the list of photographers for the photo

export default router;
