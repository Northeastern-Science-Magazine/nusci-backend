import express from "express";
import ArticlesCTRL from "../controllers/articles.controller.js";

/* Controls Routing for Finished Articles */

const router = express.Router();

router.route("/:id").get(ArticlesCTRL.apiGetArticle);

router.route("/").get(ArticlesCTRL.apiGetArticles);

export default router;
