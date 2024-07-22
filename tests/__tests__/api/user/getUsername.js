import { execSync } from "child_process";
import request from "supertest";
import app from "../../../../app/app.js";
import Connection from "../../../../app/db/connection.js";
import logTestSuite from "../../../util.js";
import { validUsernameQueryRaisa, validUsernameQueryEthan } from "../../../testData/userTestData.js";

afterAll(async () => {
  await Connection.close(!logTestSuite);
});

beforeEach(async () => {
  execSync("npm run reset-s", { stdio: "inherit" });
});

describe("Get User By Username Tests", () => {
  test("get a user by a valid/existing username raisa", async () => {
    const response = await request(app).get("/user/username/raisa");

    logTestSuite.user && console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual(validUsernameQueryRaisa);
    expect(response.body.username).toBe("raisa");
  });

  test("get a user by a valid/existing username ethan", async () => {
    const response = await request(app).get("/user/username/ethan");

    logTestSuite.user && console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual(validUsernameQueryEthan);
    expect(response.body.username).toBe("ethan");
  });

  test("attempt getting an invalid username", async () => {
    const response = await request(app).get("/user/username/nonexistentuser");

    logTestSuite.user && console.log(response.body);
    expect(response.body).toStrictEqual({ error: "User not found." });
    expect(response.status).toBe(404);
  });
});
