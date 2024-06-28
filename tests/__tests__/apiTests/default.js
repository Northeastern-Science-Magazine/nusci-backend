import request from "supertest";
import app from "../../../app/app.js";
import Connection from "../../../app/db/connection.js";
import logTestSuite from "../../util.js";

afterAll(async () => {
  await Connection.close();
});

describe("Default Router Endpoint Tests", () => {
  test("Test connecting to the API", async () => {
    const response = await request(app).get("/");
    logTestSuite.default ? console.log(response.body) : null;
    expect(response.statusCode).toBe(200);
    expect(JSON.stringify(response.body)).toBe(JSON.stringify({ message: "Successfully connected to the NU Sci API!" }));
  });

  test("Test connecting to the MongoDB instance", async () => {
    const response = await request(app).get("/db");
    logTestSuite.default ? console.log(response.body) : null;
    expect(response.statusCode).toBe(200);
    expect(JSON.stringify(response.body)).toBe(
      JSON.stringify({ message: "Successfully connected to the NU Sci Database Instance!" })
    );
  });
});
