import express from "express";
import bodyParser from "body-parser";
import Authorize from "../auth/authorization.js";
import Accounts from "../models/enums/accounts.js";
import IssueMapController from "../controllers/issueMapController.js";

const issueMap = express.Router();

issueMap.route("/create"); //create an issue map

router.route("/create"); //create an issue map
router.route("/remove-article").patch(Authorize.allow([Accounts.Admin]), IssueMapController.removeArticle); //remove an article from an issue map

export default router;
