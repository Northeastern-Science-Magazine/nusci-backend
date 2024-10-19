import fastify from "../../../../app/app.js";
import Connection from "../../../../app/db/connection.js";
import { log } from "../../../testConfig.js";

// Check if logging is enabled for this test file
const showLog = __filename
  .replace(".js", "")
  .split(/[/\\]/)
  .splice(__filename.split(/[/\\]/).lastIndexOf("__tests__") + 1)
  .reduce((acc, key) => acc && acc[key], log);

// Open the database connection before all tests
beforeAll(async () => {
  await Connection.open(!showLog);
  await fastify.ready(); // Ensure Fastify is ready before testing
});

// Close the database connection after all tests
afterAll(async () => {
  await Connection.close(!showLog);
  await fastify.close(); // Close Fastify instance after tests
});

describe("Default Router Endpoint Tests", () => {
  test("should connect to the API and return a success message", async () => {
    const response = await fastify.inject({
      method: "GET",
      url: "/",
    });
    showLog && console.log(response.json());
    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({ message: "Successfully connected to the NU Sci API!" });
  });

  test("should connect to the MongoDB instance and return a success message", async () => {
    const response = await fastify.inject({
      method: "GET",
      url: "/db",
    });
    showLog && console.log(response.json());
    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({ message: "Successfully connected to the NU Sci Database Instance!" });
  });
});
