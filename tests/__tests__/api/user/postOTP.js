import request from "supertest";
import app from "../../../../app/app.js";
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

describe("Send OTP Tests", () => {
  test("should send OTP for valid northeastern email", async () => {
    const response = await request(app).post("/user/email/forgot-password").send({
      email: "ethan@northeastern.edu",
    });

    showLog && console.log(response.body);
    expect(response.status).toBe(200);
  });

  test("should not send OTP when email is missing", async () => {
    const response = await request(app).post("/user/email/forgot-password").send({});

    showLog && console.log(response.body);
    expect(response.status).toBe(404);
  });

  test("should not send OTP for non-northeastern email", async () => {
    const response = await request(app).post("/user/email/forgot-password").send({
      email: "ethan@ethan.com",
    });

    showLog && console.log(response.body);
    expect(response.status).toBe(404);
  });
});

describe("Verify OTP Tests", () => {
  test("should not verify OTP when token is missing", async () => {
    const response = await request(app).post("/user/email/verify-otp").query({
      email: "raisa@northeastern.edu",
    });

    showLog && console.log(response.body);
    expect(response.status).toBe(400);
  });

  test("should not verify OTP when email is missing", async () => {
    const response = await request(app).post("/user/email/verify-otp").query({
      token: "sometoken.9999999999999",
    });

    showLog && console.log(response.body);
    expect(response.status).toBe(400);
  });

  test("should not verify OTP when token has no expiry", async () => {
    const response = await request(app).post("/user/email/verify-otp").query({
      token: "sometokenwithoutdot",
      email: "raisa@northeastern.edu",
    });

    showLog && console.log(response.body);
    expect(response.status).toBe(400);
  });

  test("should not verify OTP when token is expired", async () => {
    const expiredToken = `someraw.${Date.now() - 1000}`;
    const response = await request(app).post("/user/email/verify-otp").query({
      token: expiredToken,
      email: "raisa@northeastern.edu",
    });

    showLog && console.log(response.body);
    expect(response.status).toBe(400);
  });

  test("should not verify OTP when token hash is not in database", async () => {
    const futureToken = `someraw.${Date.now() + 15 * 60 * 1000}`;
    const response = await request(app).post("/user/email/verify-otp").query({
      token: futureToken,
      email: "raisa@northeastern.edu",
    });

    showLog && console.log(response.body);
    expect(response.status).toBe(400);
  });
});
