//controller for finished articles request (on the database)
import path from "path";

export default class ArticlesCTRL {
    static async apiGetArticle(req, res, next) {
        const slug = req.params.slug;

        // GET INFORMATION FROM DB HERE ONCE MODELS ARE IMPLEMENTED

        // will be templated, this is just boilerplate
        res.render("article", { slug });
    }
}
