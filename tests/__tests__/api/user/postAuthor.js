import request from "supertest";
import app from "../../../../app/app.js";
import tokens from "../../../testData/tokenTestData.js";
import { log } from "../../../testConfig.js";
import Accounts from "../../../../app/models/enums/accounts.js";
import AccountStatus from "../../../../app/models/enums/accountStatus.js";
import OTPModel from "../../../../app/models/dbModels/otp.js";
import UsersAccessor from "../../../../app/databaseAccessors/userAccessor.js";
import Password from "../../../../app/auth/password.js";
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

const editorCookie = [`token=${tokens["noah@noah.com"]}`];
const adminCookie = [`token=${tokens["ethan@ethan.com"]}`];
const newAuthor = { firstName: "Jane", lastName: "Doe", email: "doe.j@northeastern.edu" };

/** The raw invite token from the most recent mocked invite email */
const sentInviteToken = () => {
  const calls = ResendEmail.sendEmailWithTemplate.mock.calls;
  return new URL(calls[calls.length - 1][0].variables.url).searchParams.get("token");
};

describe("Create Author Tests", () => {
  test("should create an author account and send an invite as an editor", async () => {
    const response = await request(app).post("/user/author").set("Cookie", editorCookie).send(newAuthor);

    showLog && console.log(response.body);
    expect(response.status).toBe(201);
    expect(response.body).toEqual({ name: "Jane Doe", email: "doe.j@northeastern.edu", invited: true });

    const user = await UsersAccessor.getUserByEmail("doe.j@northeastern.edu");
    const noah = await UsersAccessor.getUserIdByEmail("noah@noah.com");
    expect(user.firstName).toBe("Jane");
    expect(user.lastName).toBe("Doe");
    expect([...user.roles]).toEqual([Accounts.Author.toString()]);
    expect(user.status).toBe(AccountStatus.Approved.toString());
    expect(user.approvingUser.toString()).toBe(noah._id.toString());
    expect(user.password).toBeUndefined();

    const record = await OTPModel.findOne({ email: "doe.j@northeastern.edu" });
    expect(record.purpose).toBe("invite");
    expect([...record.roles]).toEqual([Accounts.Author.toString()]);
    expect(ResendEmail.sendEmailWithTemplate).toHaveBeenCalledTimes(1);
  });

  test("should create an author as an admin", async () => {
    const response = await request(app).post("/user/author").set("Cookie", adminCookie).send(newAuthor);

    showLog && console.log(response.body);
    expect(response.status).toBe(201);
  });

  test("should list the new author for articles right away", async () => {
    await request(app).post("/user/author").set("Cookie", editorCookie).send(newAuthor);
    const response = await request(app).get("/user/list/basic").set("Cookie", editorCookie);

    showLog && console.log(response.body);
    expect(response.body).toContainEqual({ name: "Jane Doe", email: "doe.j@northeastern.edu" });
  });

  test("should show the new author's public profile", async () => {
    await request(app).post("/user/author").set("Cookie", editorCookie).send(newAuthor);
    const response = await request(app).get("/user/email/doe.j@northeastern.edu");

    showLog && console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body.firstName).toBe("Jane");
    expect(response.body.password).toBeUndefined();
  });

  test("should still create the account when the invite fails to send", async () => {
    ResendEmail.sendEmailWithTemplate.mockRejectedValueOnce(new Error("Email send failed."));
    const response = await request(app).post("/user/author").set("Cookie", editorCookie).send(newAuthor);

    showLog && console.log(response.body);
    expect(response.status).toBe(201);
    expect(response.body.invited).toBe(false);
    expect(await UsersAccessor.getUserByEmail("doe.j@northeastern.edu")).not.toBeNull();
  });

  test("should not create an author whose email already has an account", async () => {
    const response = await request(app)
      .post("/user/author")
      .set("Cookie", editorCookie)
      .send({ ...newAuthor, email: "raisa@raisa.com" });

    showLog && console.log(response.body);
    expect(response.status).toBe(409);
    expect(ResendEmail.sendEmailWithTemplate).not.toHaveBeenCalled();
  });

  test("should not create an author whose email matches an account in a different case", async () => {
    const response = await request(app)
      .post("/user/author")
      .set("Cookie", editorCookie)
      .send({ ...newAuthor, email: "Raisa@Raisa.com" });

    showLog && console.log(response.body);
    expect(response.status).toBe(409);
    expect(ResendEmail.sendEmailWithTemplate).not.toHaveBeenCalled();
  });

  test("should not create the same author twice", async () => {
    await request(app).post("/user/author").set("Cookie", editorCookie).send(newAuthor);
    const response = await request(app).post("/user/author").set("Cookie", editorCookie).send(newAuthor);

    showLog && console.log(response.body);
    expect(response.status).toBe(409);
  });

  test("should not create an author without a name", async () => {
    const response = await request(app)
      .post("/user/author")
      .set("Cookie", editorCookie)
      .send({ ...newAuthor, firstName: "  " });

    showLog && console.log(response.body);
    expect(response.status).toBe(400);
  });

  test("should not create an author with an invalid email", async () => {
    const response = await request(app)
      .post("/user/author")
      .set("Cookie", editorCookie)
      .send({ ...newAuthor, email: "not-an-email" });

    showLog && console.log(response.body);
    expect(response.status).toBe(400);
  });

  test("should not create an author as an author", async () => {
    const response = await request(app)
      .post("/user/author")
      .set("Cookie", [`token=${tokens["anika@anika.com"]}`])
      .send(newAuthor);

    showLog && console.log(response.body);
    expect(response.status).toBe(403);
  });

  test("should not create an author when not logged in", async () => {
    const response = await request(app).post("/user/author").send(newAuthor);

    showLog && console.log(response.body);
    expect(response.status).toBe(403);
  });
});

describe("Added Author Signup Tests", () => {
  test("should not log in before signing up", async () => {
    await request(app).post("/user/author").set("Cookie", editorCookie).send(newAuthor);
    const response = await request(app).post("/user/login").send({ email: newAuthor.email, password: "" });

    showLog && console.log(response.body);
    expect(response.status).toBe(400);
  });

  test("should prefill the name on the invite", async () => {
    await request(app).post("/user/author").set("Cookie", editorCookie).send(newAuthor);
    const response = await request(app).get("/user/invite").query({ token: sentInviteToken() });

    showLog && console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ email: "doe.j@northeastern.edu", firstName: "Jane", lastName: "Doe" });
  });

  test("should finish the same account on signup", async () => {
    await request(app).post("/user/author").set("Cookie", editorCookie).send(newAuthor);
    const before = await UsersAccessor.getUserByEmail(newAuthor.email);

    const response = await request(app).post("/user/signup").send({
      token: sentInviteToken(),
      password: "newpassword",
      firstName: "Janet",
      lastName: "Doe",
      graduationYear: 2028,
    });

    showLog && console.log(response.body);
    expect(response.status).toBe(201);
    expect(response.headers["set-cookie"]).toBeDefined();

    const user = await UsersAccessor.getUserByEmail(newAuthor.email);
    expect(user._id.toString()).toBe(before._id.toString());
    expect(user.firstName).toBe("Janet");
    expect(user.graduationYear).toBe(2028);
    expect([...user.roles]).toEqual([Accounts.Author.toString()]);
    expect(await Password.compare("newpassword", user.password)).toBe(true);

    const login = await request(app).post("/user/login").send({ email: newAuthor.email, password: "newpassword" });
    expect(login.status).toBe(200);
  });

  test("should add the roles from an admin's invite on signup", async () => {
    await request(app).post("/user/author").set("Cookie", editorCookie).send(newAuthor);
    const invite = await request(app)
      .post("/user/invite")
      .set("Cookie", adminCookie)
      .send({ to: [newAuthor.email], roles: [Accounts.Editor.toString()] });
    expect(invite.body.invited).toEqual([newAuthor.email]);

    const response = await request(app).post("/user/signup").send({
      token: sentInviteToken(),
      password: "newpassword",
      firstName: "Jane",
      lastName: "Doe",
      graduationYear: 2028,
    });

    showLog && console.log(response.body);
    expect(response.status).toBe(201);
    const user = await UsersAccessor.getUserByEmail(newAuthor.email);
    expect([...user.roles].sort()).toEqual([Accounts.Author.toString(), Accounts.Editor.toString()].sort());
  });

  test("should not finish the account twice", async () => {
    await request(app).post("/user/author").set("Cookie", editorCookie).send(newAuthor);
    // Two invites for the same added author, e.g. a resend.
    const firstToken = sentInviteToken();
    await request(app)
      .post("/user/invite")
      .set("Cookie", adminCookie)
      .send({ to: [newAuthor.email], roles: ["author"] });
    const secondToken = sentInviteToken();
    const body = { password: "newpassword", firstName: "Jane", lastName: "Doe", graduationYear: 2028 };

    const first = await request(app)
      .post("/user/signup")
      .send({ ...body, token: firstToken });
    const second = await request(app)
      .post("/user/signup")
      .send({ ...body, token: secondToken, password: "otherpassword" });

    showLog && console.log(second.body);
    expect(first.status).toBe(201);
    expect(second.status).toBe(409);
    const user = await UsersAccessor.getUserByEmail(newAuthor.email);
    expect(await Password.compare("newpassword", user.password)).toBe(true);
  });
});
