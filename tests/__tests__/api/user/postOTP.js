import request from "supertest";
import app from "../../../../app/app.js";
import otpTokens from "../../../testData/otpTestData.js";
import { log } from "../../../testConfig.js";
import { executeReset, injectMockConnection, closeMockConnection } from "../../../util/util.js";

const showLog = __filename
  .replace(".js", "")
  .split(/[/\\]/)
  .splice(__filename.split(/[/\\]/).lastIndexOf("__tests__") + 1)
  .reduce((acc, key) => acc && acc[key], log);
beforeEach(injectMockConnection);
beforeEach(executeReset);
afterAll(closeMockConnection);

describe("Verify OTP Tests", () => {
  test("should login with a valid login token", async () => {
    const response = await request(app).post("/user/verify-otp").query({ token: otpTokens.validLogin });

    showLog && console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Login successful.");
    expect(response.headers["set-cookie"]).toBeDefined();
  });

  test("should not login twice with the same token", async () => {
    await request(app).post("/user/verify-otp").query({ token: otpTokens.validLogin });
    const response = await request(app).post("/user/verify-otp").query({ token: otpTokens.validLogin });

    showLog && console.log(response.body);
    expect(response.status).toBe(400);
  });

  test("should not login with an expired token", async () => {
    const response = await request(app).post("/user/verify-otp").query({ token: otpTokens.expiredLogin });

    showLog && console.log(response.body);
    expect(response.status).toBe(400);
  });

  test("should not login with an invite token", async () => {
    // raisa@raisa.com has an account, so only the purpose check stops this login.
    const response = await request(app).post("/user/verify-otp").query({ token: otpTokens.existingUserInvite });

    showLog && console.log(response.body);
    expect(response.status).toBe(400);
  });

  test("should not login when token is missing", async () => {
    const response = await request(app).post("/user/verify-otp");

    showLog && console.log(response.body);
    expect(response.status).toBe(400);
  });
});
