import request from "supertest";
import app from "../../../../app/app.js";
import Connection from "../../../../app/db/connection.js";
import { log } from "../../../testConfig.js";

const showLog = __filename
  .replace(".js", "")
  .split(/[/\\]/)
  .splice(__filename.split(/[/\\]/).lastIndexOf("__tests__") + 1)
  .reduce((acc, key) => acc && acc[key], log);

beforeAll(async () => {
  await Connection.open(!showLog);
});

afterAll(async () => {
  await Connection.close(!showLog);
});

describe("Default Router Endpoint Tests", () => {
  test("Test connecting to the API", async () => {
    const response = await request(app).get("/");
    showLog && console.log(response.body);
    expect(response.statusCode).toBe(200);
    expect(JSON.stringify(response.body)).toBe(JSON.stringify({ message: "Successfully connected to the NU Sci API!" }));
  });

  test("Test connecting to the MongoDB instance", async () => {
    const response = await request(app).get("/db");
    showLog && console.log(response.body);
    expect(response.statusCode).toBe(200);
    expect(JSON.stringify(response.body)).toBe(
      JSON.stringify({ message: "Successfully connected to the NU Sci Database Instance!" })
    );
  });
});
