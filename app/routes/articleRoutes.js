import express from "express";
import ArticlesController from "../controllers/articleController.js";

/* Controls Routing for Finished Articles */

const router = express.Router();

router.route("/create"); //create an article
router.route("/filter-by-statuses/:issueNumber"); //filter by all 4 status options and issueNumber
router.route("/filter-by-user-and-role"); //get articles by username and role
router.route("/approved-by/:username"); //get articles approved by the given user
router.route("/slug/:slug"); //get article by its unique slug
router.route("/update/:slug"); //update an article
router.route("/delete/:slug"); //delete an article

export default router;
