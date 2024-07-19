import ArticlesAccessor from "../databaseAccessors/articleAccessor";
import UsersAccessor from "../databaseAccessors/userAccessor";

/**
 * ArticleController Class
 *
 * This class controls the behaviour of any web request
 * related to Articles.
 */
export default class ArticleController {
    /**
    * addInternalComment Method
    *
    * This method adds an internal, unresolved comment to the given article.
    *
    * @param {HTTP REQ} req web request object
    * @param {HTTP RES} res web response object
    * @param {function} next middleware function
    */
    static async addInternalComment(req, res, next) {
        try {
            //comment validation
            const username = Authorize.getUsername(req);
            const user = await UsersAccessor.getUserByUsername(username);

            const comment = new InternalCommentCreate({ user: user, comment: req.body.comment });

            // modify the article with the new comment
            const updatedArticle = ArticlesAccessor.addCommentBySlug(req.params.slug, comment);

            //return updated article with new comment
            res.status(201).json(updatedArticle);
        } catch (e) {
            console.log("error validation: " + e);
            ErrorValidation.throwHttp(req, res);
        }
    }
}
