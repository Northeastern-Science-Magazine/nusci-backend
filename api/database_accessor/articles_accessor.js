import mongodb from "mongodb";

const OBJECT_ID = new mongodb.ObjectId();
let reviews;

export default class ArticlesAccessor {
    static async injectDB(connection) {
        if (reviews) {
            return;
        }

        try {
            reviews = await connection
                .db("ArticleDatabase")
                .collection("ArticleInfo");
        } catch (e) {
            console.error(e);
        }
    }

    static async getArticles(articleId) {
        try {
            return await reviews.findOne({ _id: OBJECT_ID(articleId) });
        } catch (e) {
            console.error(e);
            return { error: e };
        }
    }
}
