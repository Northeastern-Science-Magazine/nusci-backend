import { execSync } from "child_process";
import request from "supertest";
import app from "../../../../app/app.js";
import Connection from "../../../../app/db/connection.js";
import { log } from "../../../testConfig.js";
import { validUserSignup, existingUsernameSignup, existingEmailSignup } from "../../../testData/userTestData.js";

const showLog = __filename
  .replace(".js", "")
  .split(/[/\\]/)
  .splice(__filename.split(/[/\\]/).lastIndexOf("__tests__") + 1)
  .reduce((acc, key) => acc && acc[key], log);

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
    expect(response.body.message).toBe("Signup successful.");
  });

  test("should not signup with existing username", async () => {
    const response = await request(app).post("/user/signup").send(existingUsernameSignup);

    showLog && console.log(response.body);
    expect(response.status).toBe(409);
  });

  test("should not signup with existing email", async () => {
    const response = await request(app).post("/user/signup").send(existingEmailSignup);

    showLog && console.log(response.body);
    expect(response.status).toBe(409);
  });
});
