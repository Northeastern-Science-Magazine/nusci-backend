import request from "supertest";
import app from "../../../../app/app.js";
import tokens from "../../../testData/tokenTestData.js";
import { log } from "../../../testConfig.js";
import Accounts from "../../../../app/models/enums/accounts.js";
import OTPModel from "../../../../app/models/dbModels/otp.js";
import UsersAccessor from "../../../../app/databaseAccessors/userAccessor.js";
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

const adminCookie = [`token=${tokens["ethan@ethan.com"]}`];

describe("Send Invite Tests", () => {
  test("should invite a new email", async () => {
    const response = await request(app)
      .post("/user/invite")
      .set("Cookie", adminCookie)
      .send({ to: ["invitee@northeastern.edu"], roles: [Accounts.Author.toString()] });

    showLog && console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ invited: ["invitee@northeastern.edu"], skipped: [], failed: [] });

    const record = await OTPModel.findOne({ email: "invitee@northeastern.edu" });
    const ethan = await UsersAccessor.getUserIdByEmail("ethan@ethan.com");
    const daysLeft = (record.expiresAt - Date.now()) / (24 * 60 * 60 * 1000);
    expect(record.purpose).toBe("invite");
    expect([...record.roles]).toEqual([Accounts.Author.toString()]);
    expect(record.invitedBy.toString()).toBe(ethan._id.toString());
    expect(daysLeft).toBeGreaterThan(6.9);
    expect(daysLeft).toBeLessThanOrEqual(7);
  });

  test("should give each recipient a different token", async () => {
    const response = await request(app)
      .post("/user/invite")
      .set("Cookie", adminCookie)
      .send({ to: ["one@northeastern.edu", "two@northeastern.edu"], roles: [Accounts.Author.toString()] });

    showLog && console.log(response.body);
    const sentEmails = ResendEmail.sendEmailWithTemplate.mock.calls.map((call) => call[0]);
    expect(sentEmails.map((email) => email.to)).toEqual([["one@northeastern.edu"], ["two@northeastern.edu"]]);
    expect(sentEmails[0].variables.url).not.toBe(sentEmails[1].variables.url);
  });

  test("should skip emails that already have an account", async () => {
    const response = await request(app)
      .post("/user/invite")
      .set("Cookie", adminCookie)
      .send({ to: ["raisa@raisa.com", "invitee@northeastern.edu"], roles: [Accounts.Author.toString()] });

    showLog && console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body.skipped).toEqual(["raisa@raisa.com"]);
    expect(response.body.invited).toEqual(["invitee@northeastern.edu"]);
  });

  test("should send one invite for a repeated email", async () => {
    const response = await request(app)
      .post("/user/invite")
      .set("Cookie", adminCookie)
      .send({ to: ["invitee@northeastern.edu", "invitee@northeastern.edu"], roles: [Accounts.Author.toString()] });

    showLog && console.log(response.body);
    expect(response.body.invited).toEqual(["invitee@northeastern.edu"]);
    expect(ResendEmail.sendEmailWithTemplate).toHaveBeenCalledTimes(1);
  });

  test("should report an email that fails to send and continue", async () => {
    ResendEmail.sendEmailWithTemplate.mockRejectedValueOnce(new Error("Email send failed."));
    const response = await request(app)
      .post("/user/invite")
      .set("Cookie", adminCookie)
      .send({ to: ["one@northeastern.edu", "two@northeastern.edu"], roles: [Accounts.Author.toString()] });

    showLog && console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body.failed).toEqual(["one@northeastern.edu"]);
    expect(response.body.invited).toEqual(["two@northeastern.edu"]);
  });

  test("should not invite when not logged in", async () => {
    const response = await request(app)
      .post("/user/invite")
      .send({ to: ["invitee@northeastern.edu"], roles: [Accounts.Author.toString()] });

    showLog && console.log(response.body);
    expect(response.status).toBe(403);
  });

  test("should not invite as an editor", async () => {
    const response = await request(app)
      .post("/user/invite")
      .set("Cookie", [`token=${tokens["noah@noah.com"]}`])
      .send({ to: ["invitee@northeastern.edu"], roles: [Accounts.Author.toString()] });

    showLog && console.log(response.body);
    expect(response.status).toBe(403);
  });

  test("should not invite with an invalid token cookie and should clear it", async () => {
    const response = await request(app)
      .post("/user/invite")
      .set("Cookie", ["token=invalid"])
      .send({ to: ["invitee@northeastern.edu"], roles: [Accounts.Author.toString()] });

    showLog && console.log(response.body);
    expect(response.status).toBe(403);
    expect(response.headers["set-cookie"][0]).toMatch(/^token=;/);
  });

  test("should not invite an empty list", async () => {
    const response = await request(app)
      .post("/user/invite")
      .set("Cookie", adminCookie)
      .send({ to: [], roles: [Accounts.Author.toString()] });

    showLog && console.log(response.body);
    expect(response.status).toBe(400);
  });

  test("should not invite with the none role", async () => {
    const response = await request(app)
      .post("/user/invite")
      .set("Cookie", adminCookie)
      .send({ to: ["invitee@northeastern.edu"], roles: [Accounts.None.toString()] });

    showLog && console.log(response.body);
    expect(response.status).toBe(400);
  });
});
