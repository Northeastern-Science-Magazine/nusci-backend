import express from "express";
import ArticlesController from "../controllers/articleController.js";
import Authorize from "../auth/authorization.js";
import Accounts from "../models/enums/accounts.js";

/* Controls Routing for Finished Articles */

const articles = express.Router();

articles.route("/create"); //create an article

// filter + get articles by -- maybe find better ways
// router.route("/filter-by-statuses-and-issue-number"); //filter by all 4 status options and issueNumber, by querys
// router.route("/filter-by-user-and-role"); //get articles by email and role, by query
// //etc

articles.route("/approved-by/:email"); //get articles approved by the given user
articles.route("/slug/:slug"); //get article by its unique slug

articles.route("/set-issue-number/:slug"); // update the issue number of this article (admin only?)

articles.patch("/article-status/:slug", Authorize.allow([Accounts.Admin]), ArticlesController.updateStatus); //update the status of a given article
articles.route("/writing-status/:slug"); //update the writing status of a given article (cannot set to eic approved)
articles.route("/admin-approve/:slug"); // EIC/admin approve an article to go live into the site.
articles.route("/design-status/:slug"); //update the design status of a given article
articles.route("/photography-status/:slug"); //update the photography status of a given article

articles.patch("/authors/:slug", Authorize.allow([Accounts.Admin]), ArticlesController.updateAuthors); //update the list of authors to this article,
articles.route("/editors/:slug"); //update the list of editor to this article,
articles.route("/designers/:slug"); //update the list of designer to this article,
articles.route("/photographers/:slug"); //update the list of photographer to this article

// idea: update is when updating article content, categories, sources, etc, but not metadata about an article
articles.route("/update/:slug"); //update an article -- need to clarify what 'update' and 'who' can update
articles.route("/delete/:slug").delete(Authorize.allow([Accounts.Admin, Accounts.Editor]), ArticlesController.deleteArticle); //delete an article

articles
  .route("/add-internal-comment/:slug") //editor or admin can add an internal comment to the given article
  .post(Authorize.allow([Accounts.Admin, Accounts.Editor]), ArticlesController.addInternalComment);
articles
  .route("/resolve-internal-comment") // editor or admin can resolve an internal comment
  .patch(Authorize.allow([Accounts.Admin, Accounts.Editor]), ArticlesController.resolveInternalComment);

export default articles;
