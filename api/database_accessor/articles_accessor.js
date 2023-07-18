import mongodb from "mongodb";

const OBJECT_ID = new mongodb.ObjectId();
let articles;

export default class ArticlesAccessor {
    static async injectDB(connection) {
        if (articles) {
            return;
        }

        try {
            articles = await connection
                .db("ArticleDatabase")
                .collection("ArticleInfo");
        } catch (e) {
            console.error(e);
        }
    }

    static async postArticles(author, article) {
        try {
            const articleDoc = {
                author: author,
                article: article
            }

            return await articles.insertOne(articleDoc)
        } catch (e) {
            console.error(e);
            return { error: e };
        }
    }

    static async getArticles(articleId) {
        try {
            return await articles.findOne({ _id: OBJECT_ID(articleId) });
        } catch (e) {
            console.error(e);
            return { error: e };
        }
    }
}
