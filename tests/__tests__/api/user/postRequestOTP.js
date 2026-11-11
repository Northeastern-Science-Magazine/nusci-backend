import request from "supertest";
import app from "../../../../app/app.js";
import otpTokens from "../../../testData/otpTestData.js";
import { log } from "../../../testConfig.js";
import AccountStatus from "../../../../app/models/enums/accountStatus.js";
import User from "../../../../app/models/dbModels/user.js";
import MockConnection from "../../../util/mockConnection.js";
import { ResendEmail } from "../../../../app/services/email/emailService.js";
import { executeReset, injectMockConnection, closeMockConnection } from "../../../util/util.js";

const showLog = __filename
  .replace(".js", "")
  .split(/[/\\]/)
  .splice(__filename.split(/[/\\]/).lastIndexOf("__tests__") + 1)
  .reduce((acc, key) => acc && acc[key], log);
beforeEach(injectMockConnection);
beforeEach(executeReset);
// Replaces the Resend call so tests never send real emails.
beforeEach(() => jest.spyOn(ResendEmail, "sendEmailWithTemplate").mockResolvedValue({ id: "test" }));
afterEach(() => jest.restoreAllMocks());
afterAll(closeMockConnection);

const sameResponse = { message: "If an account exists for this email, a link was sent." };

/**
 * Changes a seeded user before a request runs. Opens the test
 * database first, since no request has opened it yet.
 */
const updateUser = async (email, update) => {
  await MockConnection.open();
  await User.updateOne({ email: email }, update);
};

describe("Request OTP Tests", () => {
  test("should email a link to an approved user", async () => {
    const response = await request(app).post("/user/otp").send({ email: "ethan@ethan.com" });

    showLog && console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body).toEqual(sameResponse);
    const sentEmail = ResendEmail.sendEmailWithTemplate.mock.calls[0][0];
    expect(sentEmail.to).toEqual(["ethan@ethan.com"]);
    expect(sentEmail.type).toBe("otp");
  });

  test("should log in with the emailed link", async () => {
    await request(app).post("/user/otp").send({ email: "ethan@ethan.com" });
    const token = ResendEmail.sendEmailWithTemplate.mock.calls[0][0].variables.url.split("token=")[1];
    const response = await request(app).post("/user/verify-otp").query({ token: token });

    showLog && console.log(response.body);
    expect(response.status).toBe(200);
  });

  test("should stop older links from logging in", async () => {
    await request(app).post("/user/otp").send({ email: "ethan@ethan.com" });
    const response = await request(app).post("/user/verify-otp").query({ token: otpTokens.validLogin });

    showLog && console.log(response.body);
    expect(response.status).toBe(400);
  });

  test("should match the email regardless of case", async () => {
    await request(app).post("/user/otp").send({ email: "Ethan@Ethan.com" });

    expect(ResendEmail.sendEmailWithTemplate.mock.calls[0][0].to).toEqual(["ethan@ethan.com"]);
  });

  test("should give the same response without emailing an unknown address", async () => {
    const response = await request(app).post("/user/otp").send({ email: "nobody@northeastern.edu" });

    showLog && console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body).toEqual(sameResponse);
    expect(ResendEmail.sendEmailWithTemplate).not.toHaveBeenCalled();
  });

  test("should not email a pending user", async () => {
    const response = await request(app).post("/user/otp").send({ email: "kayla@kayla.com" });

    showLog && console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body).toEqual(sameResponse);
    expect(ResendEmail.sendEmailWithTemplate).not.toHaveBeenCalled();
  });

  test("should not email a deactivated user", async () => {
    await updateUser("raisa@raisa.com", { status: AccountStatus.Deactivated.toString() });
    const response = await request(app).post("/user/otp").send({ email: "raisa@raisa.com" });

    showLog && console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body).toEqual(sameResponse);
    expect(ResendEmail.sendEmailWithTemplate).not.toHaveBeenCalled();
  });

  test("should not email an account that has not signed up", async () => {
    await updateUser("raisa@raisa.com", { $unset: { password: 1 } });
    const response = await request(app).post("/user/otp").send({ email: "raisa@raisa.com" });

    showLog && console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body).toEqual(sameResponse);
    expect(ResendEmail.sendEmailWithTemplate).not.toHaveBeenCalled();
  });

  test("should reject an invalid email", async () => {
    const response = await request(app).post("/user/otp").send({ email: "not-an-email" });

    showLog && console.log(response.body);
    expect(response.status).toBe(400);
    expect(ResendEmail.sendEmailWithTemplate).not.toHaveBeenCalled();
  });
});
