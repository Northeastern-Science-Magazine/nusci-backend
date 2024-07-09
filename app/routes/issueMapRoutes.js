import express from "express";
import bodyParser from "body-parser";

const router = express.Router();

router.use(bodyParser.urlencoded({ extended: false }));

router.route("/create"); //create an issue map

router.route("/"); //get all issue maps
router.route("/:issueNumber"); //get an issue map by its issue number

router.route("/:issueNumber/add-article/:slug"); //add a prexisting article to the given issue map
router.route("/add-section"); //add a section to this issue map

// Do we event want two different endpoints for this?
router.route("/:issueNumber/:sectionName/add-article/:slug"); //add an article to the specified section
router.route("/:issueNumber/:sectionName/remove-article/:slug"); //remove an article from the specified section

export default router;
