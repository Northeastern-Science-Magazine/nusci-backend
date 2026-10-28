import express from "express";
import Authorize from "../auth/authorization.js";
import Accounts from "../models/enums/accounts.js";
import IssueMapController from "../controllers/issueMapController.js";

const issueMap = express.Router();

issueMap.route("/create"); //create an issue map
issueMap.route("/remove-article").patch(Authorize.allow([Accounts.Admin]), IssueMapController.removeArticle); //remove an article from an issue map
issueMap.route("/add-and-create-article").patch(Authorize.allow([Accounts.Admin]), IssueMapController.addAndCreateArticle);
issueMap.route("/add-article").patch(Authorize.allow([Accounts.Admin]), IssueMapController.addArticle); //add an article to an issue map
issueMap.route("/move-article").patch(Authorize.allow([Accounts.Admin]), IssueMapController.moveArticle); //move an article from its current issue map to another

export default issueMap;
