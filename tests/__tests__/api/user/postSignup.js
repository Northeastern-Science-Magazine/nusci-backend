import { execSync } from "child_process";
import request from "supertest";
import app from "../../../../app/app.js";
import Connection from "../../../../app/db/connection.js";
import logTestSuite from "../../../util.js";
import { validUserSignup, existingUsernameSignup, existingEmailSignup } from "../../../testData/userTestData.js";

afterAll(async () => {
  await Connection.close(!logTestSuite);
});

beforeEach(async () => {
  execSync("npm run reset-s", { stdio: "inherit" });
});

describe("User Signup Tests", () => {
  test("should signup a new user successfully", async () => {
    const response = await request(app).post("/user/signup").send(validUserSignup);

    logTestSuite.user && console.log(response.body);
    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Signup successful");
  });

  test("should not signup with existing username", async () => {
    const response = await request(app).post("/user/signup").send(existingUsernameSignup);

    logTestSuite.user && console.log(response.body);
    expect(response.status).toBe(400);
  });

  test("should not signup with existing email", async () => {
    const response = await request(app).post("/user/signup").send(existingEmailSignup);

    logTestSuite.user && console.log(response.body);
    expect(response.status).toBe(400);
  });
});
