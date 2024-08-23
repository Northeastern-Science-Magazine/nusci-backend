import express from "express";
import ArticlesController from "../controllers/articleController.js";
import Authorize from "../auth/authorization.js";
import Accounts from "../models/enums/accounts.js";

/* Controls Routing for Finished Articles */

const router = express.Router();

router.route("/create"); //create an article

// filter + get articles by -- maybe find better ways
// router.route("/filter-by-statuses-and-issue-number"); //filter by all 4 status options and issueNumber, by querys
// router.route("/filter-by-user-and-role"); //get articles by username and role, by query
// //etc

router.route("/approved-by/:username"); //get articles approved by the given user
router.route("/slug/:slug"); //get article by its unique slug

router.route("/set-issue-number/:slug"); // update the issue number of this article (admin only?)

router.patch("/article-status/:slug", Authorize.allow([Accounts.Admin]), ArticlesController.updateStatus); //update the status of a given article
router.route("/writing-status/:slug"); //update the writing status of a given article (cannot set to eic approved)
router.route("/admin-approve/:slug"); // EIC/admin approve an article to go live into the site.
router.route("/design-status/:slug"); //update the design status of a given article
router.route("/photography-status/:slug"); //update the photography status of a given article

router.patch("/authors/:slug", Authorize.allow([Accounts.Admin]), ArticlesController.updateAuthors); //update the list of authors to this article,
router.route("/editors/:slug"); //update the list of editor to this article,
router.route("/designers/:slug"); //update the list of designer to this article,
router.route("/photographers/:slug"); //update the list of photographer to this article

// idea: update is when updating article content, categories, sources, etc, but not metadata about an article
router.route("/update/:slug"); //update an article -- need to clarify what 'update' and 'who' can update
router.route("/delete/:slug"); //delete an article

router.route("/add-internal-comment/:slug") //editor or admin can add an internal comment to the given article
    .post(Authorize.allow([Accounts.Admin, Accounts.Editor]), ArticlesController.addInternalComment);

export default router;
