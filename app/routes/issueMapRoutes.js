import express from "express";
import bodyParser from "body-parser";
import IssueMapController from "../controllers/issueMapController";

const router = express.Router();

router.use(bodyParser.urlencoded({ extended: false }));

router.route("/create").post(Authorize.allow([Accounts.Admin]), IssueMapController.createIssueMap); //create an issue map

export default router;
