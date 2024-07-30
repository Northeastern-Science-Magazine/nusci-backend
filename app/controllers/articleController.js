import ArticlesAccessor from "../databaseAccessors/articleAccessor.js";
import UsersAccessor from "../databaseAccessors/userAccessor.js";
import Authorize from "../auth/authorization.js";
import { ErrorValidation, ErrorIncorrectUser } from "../error/httpErrors.js";
import {ErrorInternalAPIModelValidation} from "../error/internalErrors.js";
import { InternalCommentCreate } from "../models/apiModels/internalComment.js";
import { ArticleResponse } from "../models/apiModels/article.js";


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
            const userID = user._id;

            const comment = new InternalCommentCreate({ user: userID, comment: req.body.comment });

            // modify the article with the new comment
            const updatedArticle = await ArticlesAccessor.addCommentBySlug(req.params.slug, comment);
        
            const finalArticle = new ArticleResponse( updatedArticle.toObject() );

            //return updated article with new comment
            res.status(201).json(finalArticle);
        } catch (e) {
            console.log(e);
            //ErrorIncorrectUser.throwHttp(req, res);
            if (e.error == "User is incorrect.'") {
                ErrorIncorrectUser.throwHttp(req, res);
            }
            else if (e.error == "Malformed API Model.") {
                ErrorValidation.throwHttp(req,res);
            }
            else if (e instanceof ErrorInternalAPIModelValidation) {
                // throw e;
                throw new ErrorInternalAPIModelValidation(e);
            }
            else if (e instanceof TypeError) {
                throw new TypeError(e);
            }
            else {
                new throwHttp(req, res);
            }
        }
    }
}
