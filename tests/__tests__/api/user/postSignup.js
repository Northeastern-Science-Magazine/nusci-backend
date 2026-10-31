import request from "supertest";
import app from "../../../../app/app.js";
import tokens from "../../../testData/tokenTestData.js";
import otpTokens from "../../../testData/otpTestData.js";
import { log } from "../../../testConfig.js";
import Accounts from "../../../../app/models/enums/accounts.js";
import AccountStatus from "../../../../app/models/enums/accountStatus.js";
import UsersAccessor from "../../../../app/databaseAccessors/userAccessor.js";
import Password from "../../../../app/auth/password.js";
import { executeReset, injectMockConnection, closeMockConnection } from "../../../util/util.js";

const showLog = __filename
  .replace(".js", "")
  .split(/[/\\]/)
  .splice(__filename.split(/[/\\]/).lastIndexOf("__tests__") + 1)
  .reduce((acc, key) => acc && acc[key], log);
beforeEach(injectMockConnection);
beforeEach(executeReset);
afterAll(closeMockConnection);

const signupBody = (token) => ({
  token: token,
  password: "newpassword",
  firstName: "New",
  lastName: "User",
  graduationYear: 2027,
});

describe("User Signup Tests", () => {
  test("should signup a new user from a valid invite", async () => {
    const response = await request(app).post("/user/signup").send(signupBody(otpTokens.validInvite));

    showLog && console.log(response.body);
    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Signup successful.");
    expect(response.headers["set-cookie"]).toBeDefined();

    const user = await UsersAccessor.getUserByEmail("newuser@northeastern.edu");
    expect(user.status).toBe(AccountStatus.Approved.toString());
    expect([...user.roles]).toEqual([Accounts.Author.toString()]);
    expect(user.password).not.toBe("newpassword");
    expect(await Password.compare("newpassword", user.password)).toBe(true);
  });

  test("should ignore email, roles, and status sent in the body", async () => {
    const response = await request(app)
      .post("/user/signup")
      .send({
        ...signupBody(otpTokens.validInvite),
        email: "someoneelse@northeastern.edu",
        roles: [Accounts.Admin.toString()],
        status: AccountStatus.Pending.toString(),
      });

    showLog && console.log(response.body);
    expect(response.status).toBe(201);

    const user = await UsersAccessor.getUserByEmail("newuser@northeastern.edu");
    expect([...user.roles]).toEqual([Accounts.Author.toString()]);
    expect(user.status).toBe(AccountStatus.Approved.toString());
    expect(await UsersAccessor.getUserByEmail("someoneelse@northeastern.edu")).toBeNull();
  });

  test("should not signup twice with the same invite", async () => {
    await request(app).post("/user/signup").send(signupBody(otpTokens.validInvite));
    const response = await request(app).post("/user/signup").send(signupBody(otpTokens.validInvite));

    showLog && console.log(response.body);
    expect(response.status).toBe(400);
  });

  test("should not signup with a used invite", async () => {
    const response = await request(app).post("/user/signup").send(signupBody(otpTokens.usedInvite));

    showLog && console.log(response.body);
    expect(response.status).toBe(400);
  });

  test("should not signup with an expired invite", async () => {
    const response = await request(app).post("/user/signup").send(signupBody(otpTokens.expiredInvite));

    showLog && console.log(response.body);
    expect(response.status).toBe(400);
  });

  test("should not signup with a login token", async () => {
    const response = await request(app).post("/user/signup").send(signupBody(otpTokens.validLogin));

    showLog && console.log(response.body);
    expect(response.status).toBe(400);
  });

  test("should not signup without a graduation year", async () => {
    const { graduationYear, ...body } = signupBody(otpTokens.validInvite);
    const response = await request(app).post("/user/signup").send(body);

    showLog && console.log(response.body);
    expect(response.status).toBe(400);
  });

  test("should not signup with a password under 8 characters", async () => {
    const response = await request(app)
      .post("/user/signup")
      .send({ ...signupBody(otpTokens.validInvite), password: "short" });

    showLog && console.log(response.body);
    expect(response.status).toBe(400);
  });

  test("should not signup with an existing email", async () => {
    const response = await request(app).post("/user/signup").send(signupBody(otpTokens.existingUserInvite));

    showLog && console.log(response.body);
    expect(response.status).toBe(409);
  });

  test("should not signup when already logged in", async () => {
    const response = await request(app)
      .post("/user/signup")
      .set("Cookie", [`token=${tokens["ethan@ethan.com"]}`])
      .send(signupBody(otpTokens.validInvite));

    showLog && console.log(response.body);
    expect(response.status).toBe(409);
  });

  test("should signup with an invalid token cookie", async () => {
    const response = await request(app)
      .post("/user/signup")
      .set("Cookie", ["token=invalid"])
      .send(signupBody(otpTokens.validInvite));

    showLog && console.log(response.body);
    expect(response.status).toBe(201);
  });
});
