import express from "express";
import ArticlesCTRL from "../controllers/articles.controller.js";

/* Controls Routing for Finished Articles */

const router = express.Router();

//.get(ArticlesCTRL.apiGetArticle)
router.route("/:id");

router.route("/").get(ArticlesCTRL.apiGetArticles);

export default router;
