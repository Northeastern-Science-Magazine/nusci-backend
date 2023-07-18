import { Schema, model } from '../db/connection.js';
// article Schema
const ArticleSchema = new Schema(
    {
        title: String,
        author: String,
        date: Date,
        body: String,
        pullquotes: [{type: String}],
        sources: [{type: String}],
        comments: [{
            author: String,
            date: Date,
            body: String
        }]
    }
)

// article model
const Article = model("Article", ArticleSchema)

export default Article;