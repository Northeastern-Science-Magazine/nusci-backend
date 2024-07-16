import express from "express";
import ArticlesController from "../controllers/articleController.js";

/* Controls Routing for Finished Articles */

const router = express.Router();

router.route("/create"); //create an article. If assigned an issue number, assign to that issue map if exists

router.route("/"); //get articles with filter object

router.route("/approved-by/:username"); //get articles approved by the given user
router.route("/slug/:slug"); //get article by its unique slug

router.route("/set-issue-number/:slug"); // update the issue number of this article (admin only?)

router.route("/article-status/:slug"); //update the status of a given article
router.route("/writing-status/:slug"); //update the writing status of a given article (cannot set to eic approved)
router.route("/admin-approve/:slug"); // EIC/admin approve an article to go live into the site.
router.route("/design-status/:slug"); //update the design status of a given article
router.route("/photography-status/:slug"); //update the photography status of a given article

router.route("/authors/:slug"); //update the list of authors to this article,
router.route("/editors/:slug"); //update the list of editor to this article,
router.route("/designers/:slug"); //update the list of designer to this article,
router.route("/photographers/:slug"); //update the list of photographer to this article

router.route("/comments/internal/add/:slug"); //editors and admins should be able to make internal comments
router.route("/comments/internal/resolve/:id"); //resolve the comment
router.route("/comments/add"); //anyone with an account should be able to make a public comment

// idea: update is when updating article content, categories, sources, etc, but not metadata about an article
router.route("/update/:slug"); //update an article -- need to clarify what 'update' and 'who' can update
router.route("/delete/:slug"); //delete an article

export default router;
