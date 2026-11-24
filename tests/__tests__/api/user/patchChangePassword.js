import request from "supertest";
import app from "../../../../app/app.js";
import { log } from "../../../testConfig.js";
import tokens from "../../../testData/tokenTestData.js";
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

const ethanCookie = [`token=${tokens["ethan@ethan.com"]}`];
const changePassword = (body, cookie = ethanCookie) =>
  request(app).patch("/user/me/password").set("Cookie", cookie).send(body);
const login = (password) => request(app).post("/user/login").send({ email: "ethan@ethan.com", password });

describe("Change own password tests", () => {
  test("should change the password with the correct current password", async () => {
    const response = await changePassword({ currentPassword: "123", newPassword: "newpassword" });

    showLog && console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "Password updated." });
    expect(JSON.stringify(response.body)).not.toMatch(/password"/);

    expect((await login("newpassword")).status).toBe(200);
    expect((await login("123")).status).toBe(400);
  });

  test("should store the new password hashed", async () => {
    await changePassword({ currentPassword: "123", newPassword: "newpassword" });

    const user = await UsersAccessor.getUserByEmail("ethan@ethan.com");
    expect(user.password).not.toBe("newpassword");
    expect(await Password.compare("newpassword", user.password)).toBe(true);
  });

  test("should work for an author", async () => {
    await UsersAccessor.updateUserByEmail("anika@anika.com", { password: await Password.hash("anikapassword", 10) });

    const response = await changePassword({ currentPassword: "anikapassword", newPassword: "newpassword" }, [
      `token=${tokens["anika@anika.com"]}`,
    ]);

    showLog && console.log(response.body);
    expect(response.status).toBe(200);
  });

  test("should not change the password with the wrong current password", async () => {
    const response = await changePassword({ currentPassword: "wrong", newPassword: "newpassword" });

    showLog && console.log(response.body);
    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Current password is incorrect.");
    expect((await login("123")).status).toBe(200);
  });

  test("should not accept a new password shorter than 8 characters", async () => {
    const response = await changePassword({ currentPassword: "123", newPassword: "short" });

    showLog && console.log(response.body);
    expect(response.status).toBe(400);
    expect((await login("123")).status).toBe(200);
  });

  test("should not accept a new password equal to the current one", async () => {
    await UsersAccessor.updateUserByEmail("ethan@ethan.com", { password: await Password.hash("samepassword", 10) });

    const response = await changePassword({ currentPassword: "samepassword", newPassword: "samepassword" });

    showLog && console.log(response.body);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("New password must be different from the current password.");
  });

  test("should not accept a missing current password", async () => {
    const response = await changePassword({ newPassword: "newpassword" });

    showLog && console.log(response.body);
    expect(response.status).toBe(400);
  });

  test("should not change the password when not logged in", async () => {
    const response = await request(app)
      .patch("/user/me/password")
      .send({ currentPassword: "123", newPassword: "newpassword" });

    showLog && console.log(response.body);
    expect(response.status).toBe(403);
    expect((await login("123")).status).toBe(200);
  });

  test("should not change the password through the profile update", async () => {
    await request(app).patch("/user/me").set("Cookie", ethanCookie).send({ password: "newpassword" });

    expect((await login("123")).status).toBe(200);
    expect((await login("newpassword")).status).toBe(400);
  });
});
