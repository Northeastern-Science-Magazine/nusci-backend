import request from "supertest";
import app from "../../../../app/app.js";
import tokens from "../../../testData/tokenTestData.js";
import { log } from "../../../testConfig.js";
import Accounts from "../../../../app/models/enums/accounts.js";
import AccountStatus from "../../../../app/models/enums/accountStatus.js";
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

describe("User sign up flow", () => {
  test("Admin invites, user opens invite, signs up, and requests profile", async () => {
    const inviteResponse = await request(app)
      .post("/user/invite")
      .set("Cookie", [`token=${tokens["ethan@ethan.com"]}`])
      .send({ to: ["flow@northeastern.edu"], roles: [Accounts.Author.toString()] });
    expect(inviteResponse.status).toBe(200);

    // The raw token only exists in the emailed link.
    const url = ResendEmail.sendEmailWithTemplate.mock.calls[0][0].variables.url;
    const token = url.split("token=")[1];

    const openResponse = await request(app).get("/user/invite").query({ token: token });
    expect(openResponse.status).toBe(200);
    expect(openResponse.body.email).toBe("flow@northeastern.edu");

    const signupResponse = await request(app).post("/user/signup").send({
      token: token,
      password: "flowpassword",
      firstName: "Flow",
      lastName: "User",
      graduationYear: 2027,
    });
    expect(signupResponse.status).toBe(201);

    const profileResponse = await request(app).get("/user/me").set("Cookie", signupResponse.headers["set-cookie"]);

    showLog && console.log(profileResponse.body);
    const ethan = await UsersAccessor.getUserIdByEmail("ethan@ethan.com");
    expect(profileResponse.status).toBe(200);
    expect(profileResponse.body.email).toBe("flow@northeastern.edu");
    expect(profileResponse.body.status).toBe(AccountStatus.Approved.toString());
    expect(profileResponse.body.roles).toEqual([Accounts.Author.toString()]);
    expect(profileResponse.body.approvingUser).toBe(ethan._id.toString());
  });
});
