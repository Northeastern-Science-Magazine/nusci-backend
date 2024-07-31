import request from "supertest";
import app from "../../../app/app.js";
import Connection from "../../../app/db/connection.js";
import logTestSuite from "../../util.js";
import tokens from "../../testData/tokenTestData.js";
import {
    validArticleStatusUpdate,
    invalidArticleStatusUpdate,
    validAuthorsUpdate,
    emptyAuthorsUpdate,
    invalidAuthorsUpdate,
    validArticleSlug,
    invalidArticleSlug,
} from "../../testData/articleTestData.js";

afterAll(async () => {
    await Connection.close();
});

describe("Article Controller Tests", () => {
    describe("Update Article Status", () => {
        test("should update article status successfully", async () => {
            const response = await request(app)
                .patch(`/articles/article-status/${validArticleSlug}`)
                .set("Cookie", [`token=${tokens.ethan}`])
                .send(validArticleStatusUpdate);

            logTestSuite.article && console.log(response.body);
            expect(response.status).toBe(200);
            expect(response.body.articleStatus).toBe(validArticleStatusUpdate.articleStatus);
        });

        test("should fail to update article status due to invalid status type", async () => {
            const response = await request(app)
                .patch(`/articles/article-status/${validArticleSlug}`)
                .set("Cookie", [`token=${tokens.ethan}`])
                .send(invalidArticleStatusUpdate);

            logTestSuite.article && console.log(response.body);
            expect(response.status).toBe(400);
            expect(response.body.error).toBeDefined();
        });

        test("should fail to update article status due to invalid permissions", async () => {
            const response = await request(app)
                .patch(`/articles/article-status/${validArticleSlug}`)
                .set("Cookie", [`token=${tokens.jasmine}`])
                .send(validArticleStatusUpdate);

            logTestSuite.article && console.log(response.body);
            expect(response.status).toBe(403);
            expect(response.body.error).toBeDefined();
        });
    });

    describe("Update Article Authors", () => {
        test("should update article authors successfully", async () => {
            const response = await request(app)
                .patch(`/articles/authors/${validArticleSlug}`)
                .set("Cookie", [`token=${tokens.ethan}`])
                .send(validAuthorsUpdate);

            logTestSuite.article && console.log(response.body);
            expect(response.status).toBe(200);
            expect(response.body.authors).toEqual(expect.arrayContaining(validAuthorsUpdate.authorsIDs));
        });

        test("should update article authors to an empty list", async () => {
            const response = await request(app)
                .patch(`/articles/authors/${validArticleSlug}`)
                .set("Cookie", [`token=${tokens.ethan}`])
                .send(emptyAuthorsUpdate);

            logTestSuite.article && console.log(response.body);
            expect(response.status).toBe(200);
            expect(response.body.authors).toEqual([]);
        });

        test("should fail to update article authors due to invalid author username", async () => {
            const response = await request(app)
                .patch(`/articles/authors/${validArticleSlug}`)
                .set("Cookie", [`token=${tokens.ethan}`])
                .send(invalidAuthorsUpdate);

            logTestSuite.article && console.log(response.body);
            expect(response.status).toBe(500);
            expect(response.body.error).toBeDefined();
        });
    });

    describe("Article Internal Comment Tests", () => {
        test("valid create comment (admin)", async () => {
            const response = await request(app)
                .post("/articles/add-internal-comment/world-death-rate-holding-steady-at-100-percent-2")
                .send({ comment: "second line should be clearer" })
                .set("Cookie", [`token=${tokens.ethan}`]);

            logTestSuite.article && console.log(response.body);
            expect(response.status).toBe(201);
            expect(response.body.comments[0].comment).toBe("second line should be clearer");
        });

        test("valid create comment (editor)", async () => {
            const response = await request(app)
                .post("/articles/add-internal-comment/exploring-the-future-ai-integration-in-everyday-life")
                .send({ comment: "looks great, will publish soon" })
                .set("Cookie", [`token=${tokens.noah}`]);

            logTestSuite.article && console.log(response.body);
            expect(response.status).toBe(201);
            expect(response.body.comments[2].comment).toBe("looks great, will publish soon");
        });

        test("invalid create comment (malformed comment object)", async () => {
            const response = await request(app)
                .post("/articles/add-internal-comment/exploring-the-future-ai-integration-in-everyday-life")
                .send({ note: "this is a note" })
                .set("Cookie", [`token=${tokens.noah}`]);

            logTestSuite.article && console.log(response.body);
            expect(response.status).toBe(400);
            expect(response.body).toStrictEqual({ error: "Field 'comment' is required." });
        });

        test("invalid create comment (invalid slug)", async () => {
            const response = await request(app)
                .post("/articles/add-internal-comment/this-is-a-fake-slug")
                .send({ comment: "this is a comment" })
                .set("Cookie", [`token=${tokens.noah}`]);

            logTestSuite.article && console.log(response.body);
            expect(response.status).toBe(400);
            expect(response.body).toBe(null);
        });

        test("invalid create comment (invalid login)", async () => {
            const response = await request(app)
                .post("/articles/add-internal-comment/this-is-a-fake-slug")
                .send({ comment: "this is a comment" })
                .set("Cookie", [`token=${tokens.arushi}`]);

            logTestSuite.article && console.log(response.body);
            expect(response.status).toBe(403);
            expect(response.body).toStrictEqual({ error: "User is incorrect." });
        });
    });
});