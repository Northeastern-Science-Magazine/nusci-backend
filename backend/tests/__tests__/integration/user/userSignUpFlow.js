import request from "supertest";
import app from "../../../../app/app.js";
import Connection from "../../../../app/db/connection.js";

afterAll(async () => {
  await Connection.close();
});

describe("User sign up flow", () => {
  test("User sign up, log in, and request profile", async () => {
    const response = await request(app).get("/");
  });
});
