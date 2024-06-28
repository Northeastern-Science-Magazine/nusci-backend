import request from "supertest";
import app from "../../../app/app.js";
import Connection from "../../../app/db/connection.js";

afterAll(async () => {
  await Connection.close();
});

test("Test default route", async () => {
  const response = await request(app).get("/");
  expect(response.statusCode).toBe(200);
  expect(JSON.stringify(response.body)).toBe(JSON.stringify({ message: "Successfully connected to the NU Sci API!" }));
});
