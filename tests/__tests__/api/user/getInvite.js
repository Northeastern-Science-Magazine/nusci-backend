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

describe("Get Invite Tests", () => {
  test("should return the email for a valid invite", async () => {
    const response = await request(app).get("/user/invite").query({ token: otpTokens.validInvite });

    showLog && console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body.email).toBe("newuser@northeastern.edu");
  });

  test("should not use up the invite when opened", async () => {
    await request(app).get("/user/invite").query({ token: otpTokens.validInvite });
    const response = await request(app).get("/user/invite").query({ token: otpTokens.validInvite });

    showLog && console.log(response.body);
    expect(response.status).toBe(200);
  });

  test("should not return a used invite", async () => {
    const response = await request(app).get("/user/invite").query({ token: otpTokens.usedInvite });

    showLog && console.log(response.body);
    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Invite link is invalid or expired.");
  });

  test("should not return an expired invite", async () => {
    const response = await request(app).get("/user/invite").query({ token: otpTokens.expiredInvite });

    showLog && console.log(response.body);
    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Invite link is invalid or expired.");
  });

  test("should not accept a login token as an invite", async () => {
    const response = await request(app).get("/user/invite").query({ token: otpTokens.validLogin });

    showLog && console.log(response.body);
    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Invite link is invalid or expired.");
  });

  test("should not return an unknown token", async () => {
    const response = await request(app).get("/user/invite").query({ token: "not-a-real-token" });

    showLog && console.log(response.body);
    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Invite link is invalid or expired.");
  });

  test("should not accept a missing token", async () => {
    const response = await request(app).get("/user/invite");

    showLog && console.log(response.body);
    expect(response.status).toBe(400);
  });

  test("should not accept a repeated token query", async () => {
    const response = await request(app).get(`/user/invite?token=${otpTokens.validInvite}&token=other`);

    showLog && console.log(response.body);
    expect(response.status).toBe(400);
  });
});
