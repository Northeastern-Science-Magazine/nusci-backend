import request from "supertest";
import app from "../../../app/app.js";
import Connection from "../../../app/db/connection.js";
import logTestSuite from "../../util.js";

afterAll(async () => {
    await Connection.close();
});

describe("Create PhotoTags Test", () => {
    test("Same tag names", async () => {
        const response = await request(app).get("/create");
        
        //expect(response.statusCode).toBe(201);

    })
})