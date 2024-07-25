import request from "supertest";
import app from "../../../app/app.js";
import Connection from "../../../app/db/connection.js";
import logTestSuite from "../../util.js";

import {
    validUserLoginRaisa,
} from "../../testData/userTestData.js";

import {
    validComment1,
} from "../../testData/userTestData.js";

afterAll(async () => {
    await Connection.close();
});

describe("Article Internal Comment Tests", () => {
    test("valid create comment (admin)", async () => {
        await request(app).post("/user/login").send(validUserLoginRaisa);
        const response = await request(app).post("/articles/add-internal-comment/world-death-rate-holding-steady-at-100-percent-2").send({ comment: "second line should be " });

        logTestSuite.article && console.log(response.body); // && console.log(response0.body);
        // expect(response.status).toBe(201);
        expect(response.error).toBe("");
        // expect(response.status.message).toBe("");
        // expect(response.body.message).toBe("Login successful");
        // expect(response.headers["set-cookie"]).toBeDefined();
    });
});