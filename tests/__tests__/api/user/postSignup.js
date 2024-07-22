import { execSync } from "child_process";
import request from "supertest";
import app from "../../../../app/app.js";
import Connection from "../../../../app/db/connection.js";
import { log } from "../../../testConfig.js";
import { validUserSignup, existingUsernameSignup, existingEmailSignup } from "../../../testData/userTestData.js";

const showLog =
  log[__filename.split("/")[__filename.split("/").length - 3]][__filename.split("/")[__filename.split("/").length - 2]][
    __filename.split("/")[__filename.split("/").length - 1].slice(0, -3)
  ];

beforeAll(async () => {
  await Connection.open(true);
});

afterAll(async () => {
  await Connection.close(true);
});

beforeEach(async () => {
  execSync("npm run reset-s", { stdio: "ignore" });
});

describe("User Signup Tests", () => {
  test("should signup a new user successfully", async () => {
    const response = await request(app).post("/user/signup").send(validUserSignup);

    showLog && console.log(response.body);
    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Signup successful");
  });

  test("should not signup with existing username", async () => {
    const response = await request(app).post("/user/signup").send(existingUsernameSignup);

    showLog && console.log(response.body);
    expect(response.status).toBe(400);
  });

  test("should not signup with existing email", async () => {
    const response = await request(app).post("/user/signup").send(existingEmailSignup);

    showLog && console.log(response.body);
    expect(response.status).toBe(400);
  });
});
