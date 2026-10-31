import express from "express";
import ArticlesController from "../controllers/articleController.js";
import Authorize from "../auth/authorization.js";
import Accounts from "../models/enums/accounts.js";

/* Controls Routing for Finished Articles */

const articles = express.Router();

articles.route("/create").post(ArticlesController.createArticle);
articles.route("/slug/:slug").get(ArticlesController.getArticleBySlug); //get article by slug
articles.route("/search").post(ArticlesController.search);
//articles.route("/approved-by/:email"); //internal use only (aka. need an account)

/* Targeted Update Endpoints */
// articles.route("/article-status/:slug").patch(Authorize.allow([Accounts.Admin]), ArticlesController.updateStatus); //update the status of a given article
// articles.route("/writing-status/:slug"); //update the writing status of a given article (cannot set to eic approved)
// articles.route("/design-status/:slug"); //update the design status of a given article
// articles.route("/photography-status/:slug"); //update the photography status of a given article
// articles.route("/editors/:slug"); //update the list of editor to this article,
// articles.route("/designers/:slug"); //update the list of designer to this article,
// articles.route("/photographers/:slug"); //update the list of photographer to this article

// articles.route("/admin-approve/:slug"); // EIC/admin approve an article to go live into the site.

// edit is for article content, categories, sources, etc, but not metadata about an article
articles.route("/edit/:slug").patch(Authorize.allow([Accounts.Admin, Accounts.Editor]), ArticlesController.editArticle); //edit any of an article's title, content, authors, categories, sources, and issue number
// articles.route("/delete/:slug"); //delete an article

// articles
// .route("/add-internal-comment/:slug") //editor or admin can add an internal comment to the given article
// .post(Authorize.allow([Accounts.Admin, Accounts.Editor]), ArticlesController.addInternalComment);
// articles
// .route("/resolve-internal-comment") // editor or admin can resolve an internal comment
// .patch(Authorize.allow([Accounts.Admin, Accounts.Editor]), ArticlesController.resolveInternalComment);

export default articles;