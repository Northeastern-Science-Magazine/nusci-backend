import express from "express";
import Authorize from "../auth/authorization.js";
import Accounts from "../models/enums/accounts.js";
import ArchivedIssueController from "../controllers/archivedIssueController.js";

/* Controls Routing for archived (print) issues */

const archive = express.Router();

archive
  .route("/")
  .get(ArchivedIssueController.getAll) //list all archived issues
  .post(Authorize.allow([Accounts.Admin, Accounts.Editor]), ArchivedIssueController.create); //archive an uploaded issue
archive
  .route("/:issueNumber")
  .get(ArchivedIssueController.getByNumber) //get an archived issue
  .delete(Authorize.allow([Accounts.Admin, Accounts.Editor]), ArchivedIssueController.delete); //delete an archived issue and its files

export default archive;
