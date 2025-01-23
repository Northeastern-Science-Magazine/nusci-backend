import express from "express";
import ArticlesController from "../controllers/articleController.js";
import Authorize from "../auth/authorization.js";
import Accounts from "../models/enums/accounts.js";

/* Controls Routing for Finished Articles */

const articles = express.Router();

articles.route("/create");
articles.route("/slug/:slug"); //get article by slug
articles.route("/search").get(ArticlesController.search);
articles.route("/search/title").get(ArticlesController.searchByTitle);
articles.route("/search/title-and-content").get(ArticlesController.searchByTitleAndContent);
articles.route("/approved-by/:email"); //internal use only (aka. need an account)

/* Targeted Update Endpoints */
articles.route("/article-status/:slug").patch(Authorize.allow([Accounts.Admin]), ArticlesController.updateStatus); //update the status of a given article
articles.route("/writing-status/:slug"); //update the writing status of a given article (cannot set to eic approved)
articles.route("/design-status/:slug"); //update the design status of a given article
articles.route("/photography-status/:slug"); //update the photography status of a given article
articles.route("/authors/:slug").patch(Authorize.allow([Accounts.Admin]), ArticlesController.updateAuthors); //update the list of authors to this article,
articles.route("/editors/:slug"); //update the list of editor to this article,
articles.route("/designers/:slug"); //update the list of designer to this article,
articles.route("/photographers/:slug"); //update the list of photographer to this article

articles.route("/admin-approve/:slug"); // EIC/admin approve an article to go live into the site.

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
