import express from "express";
import ArticlesController from "../controllers/articles.controller.js";

/* Controls Routing for Finished Articles */

const router = express.Router();

//.get(ArticlesCTRL.apiGetArticle)
router.route("/:id");

router.route("/").get(ArticlesController.getAllArticles);

export default router;
