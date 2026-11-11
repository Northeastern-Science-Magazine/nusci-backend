import request from "supertest";
import app from "../../../../app/app.js";
import tokens from "../../../testData/tokenTestData.js";
import { log } from "../../../testConfig.js";
import Email from "../../../../app/models/dbModels/email.js";
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

describe("Send Email Tests", () => {
  const testReminderEmail = {
    type: "reminder",
    from: "aggarwal.arus@northeastern.edu",
    to: ["rodriguezvazquez.a@northeastern.edu"],
    subject: "this is a test",
    reminderTitle: "Run for head of photography",
    reminderDate: new Date().toLocaleDateString(),
  };

  test("Send reminder email successfully", async () => {
    const response = await request(app)
      .post(`/email/send`)
      .set("Cookie", [`token=${tokens["ethan@ethan.com"]}`])
      .send(testReminderEmail);

    showLog && console.log(response.body);
    expect(response.status).toBe(200);
  });

  test("should not send email when not logged in", async () => {
    const response = await request(app).post(`/email/send`).send(testReminderEmail);

    showLog && console.log(response.body);
    expect(response.status).toBe(403);
  });

  test("should not send email as an editor", async () => {
    const response = await request(app)
      .post(`/email/send`)
      .set("Cookie", [`token=${tokens["noah@noah.com"]}`])
      .send(testReminderEmail);

    showLog && console.log(response.body);
    expect(response.status).toBe(403);
  });

  test("should not send invites through the email route", async () => {
    const response = await request(app)
      .post(`/email/send`)
      .set("Cookie", [`token=${tokens["ethan@ethan.com"]}`])
      .send({ type: "invite_user", to: ["invitee@northeastern.edu"], inviteUrl: "https://example.com" });

    showLog && console.log(response.body);
    expect(response.status).toBe(400);
  });

  test("should give each OTP recipient a link that logs in as them", async () => {
    const response = await request(app)
      .post(`/email/send`)
      .set("Cookie", [`token=${tokens["ethan@ethan.com"]}`])
      .send({ type: "otp", to: ["ethan@ethan.com", "raisa@raisa.com"] });

    showLog && console.log(response.body);
    expect(response.status).toBe(200);
    const sentEmails = ResendEmail.sendEmailWithTemplate.mock.calls.map((call) => call[0]);
    expect(sentEmails.map((email) => email.to)).toEqual([["ethan@ethan.com"], ["raisa@raisa.com"]]);

    // raisa@raisa.com is second on the list, so a shared token would log her in as ethan@ethan.com.
    for (const sentEmail of sentEmails) {
      const token = sentEmail.variables.url.split("token=")[1];
      const login = await request(app).post("/user/verify-otp").query({ token: token });
      const me = await request(app).get("/user/me").set("Cookie", login.headers["set-cookie"]);
      expect(me.body.email).toBe(sentEmail.to[0]);
    }
  });

  test("should not store the login link in the email record", async () => {
    // The email database is not reset between tests, so only records from this request are checked.
    const sentAfter = new Date();
    await request(app)
      .post(`/email/send`)
      .set("Cookie", [`token=${tokens["ethan@ethan.com"]}`])
      .send({ type: "otp", to: ["ethan@ethan.com"] });

    const record = await Email.findOne({ type: "otp", creationTime: { $gte: sentAfter } });
    expect(record).not.toBeNull();
    expect(record.variables?.url).toBeUndefined();
  });
});
