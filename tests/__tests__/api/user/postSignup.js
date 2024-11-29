import request from "supertest";
import app from "../../../../app/app.js";
import { log } from "../../../testConfig.js";
import { validEmailSignup, existingEmailSignup } from "../../../testData/userTestData.js";
import { executeReset, injectMockConnection, closeMockConnection } from "../../../util/util.js";

const showLog = __filename
  .replace(".js", "")
  .split(/[/\\]/)
  .splice(__filename.split(/[/\\]/).lastIndexOf("__tests__") + 1)
  .reduce((acc, key) => acc && acc[key], log);
beforeEach(injectMockConnection);
beforeEach(executeReset);
afterAll(closeMockConnection);

describe("User Signup Tests", () => {
  test("should signup a new user successfully", async () => {
    const response = await request(app).post("/user/signup").send(validEmailSignup);

    showLog && console.log(response.body);
    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Signup successful.");
  });

  test("should not signup with existing email", async () => {
    const response = await request(app).post("/user/signup").send(existingEmailSignup);

    showLog && console.log(response.body);
    expect(response.status).toBe(409);
  });
});
