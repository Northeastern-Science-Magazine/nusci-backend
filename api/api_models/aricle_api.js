import { BaseModel } from "./base_model.js";
import { BaseModelUpdate } from "./base_model.js";
import { ErrorInternalAPIModelValidation } from "../error/internal_errors.js";
import Article from "../models/article.js";
import ArticleStatus from "../models/enums/article_status.js"

export class ArticleCreate extends BaseModel {
    static schema = {
        title: { type: String, required: true },
        categories: { type: [String], required: true },
        articleContent: [
        {
            contentType: { type: ArticleContent.listStr, required: true },
            content: { type: String, required: true },
        },
        ],
        sources: { type: [String], required: true },
        link: { type: String },
        pageLength: { type: Number, required: true },
        comments: [
        {
            user: { type: Schema.Types.ObjectId, ref: "Users", required: true },
            comment: { type: String, required: true },
            commentStatus: { type: String, enum: CommentStatus.listStr, required: true },
            creationTime: { type: Date, required: true },
            modificationTime: { type: Date, required: true },
        },
        ],
        pageLength: { type: Number, required: true },
        authors: [{ type: Schema.Types.ObjectId, ref: "Users" }],
    }
       
    constructor(json) {
        try{
            super(json, ArticleCreate.schema)
        } catch(e) {
          throw new ErrorInternalAPIModelValidation(e.message);
        }

        this.title = json.title
        this.slug = json.slug
        this.issueNumber = json.issueNumber
        this.


        this.creationTime = Date.now()
        this.modificationTime = Date.now()
    }
}

export class ArticleEdit extends ArticleCreate {}