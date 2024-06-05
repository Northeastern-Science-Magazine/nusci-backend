import express from "express";
import ArticlesController from "../controllers/articles.controller.js";

/* Controls Routing for Finished Articles */

const router = express.Router();

router.route("/:slug").get(ArticlesController.getArticleBySlug);

router.route("/").get(ArticlesController.getAllArticles);

export default router;
