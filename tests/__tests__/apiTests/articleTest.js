import request from "supertest";
import app from "../../../app/app.js";
import Connection from "../../../app/db/connection.js";
import logTestSuite from "../../util.js";

import tokens from "../../testData/tokenTestData.js";

afterAll(async () => {
    await Connection.close();
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
        expect(response.status).toBe(404);
        expect(response.body).toStrictEqual({ error: "User is incorrect." });
    });
});