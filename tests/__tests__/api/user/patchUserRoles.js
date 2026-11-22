import request from "supertest";
import app from "../../../../app/app.js";
import tokens from "../../../testData/tokenTestData.js";
import { log } from "../../../testConfig.js";
import Accounts from "../../../../app/models/enums/accounts.js";
import UsersAccessor from "../../../../app/databaseAccessors/userAccessor.js";
import { executeReset, injectMockConnection, closeMockConnection } from "../../../util/util.js";

const showLog = __filename
  .replace(".js", "")
  .split(/[/\\]/)
  .splice(__filename.split(/[/\\]/).lastIndexOf("__tests__") + 1)
  .reduce((acc, key) => acc && acc[key], log);
beforeEach(injectMockConnection);
beforeEach(executeReset);
afterAll(closeMockConnection);

const adminCookie = [`token=${tokens["ethan@ethan.com"]}`];
const editorCookie = [`token=${tokens["noah@noah.com"]}`];

describe("Update User Roles Tests", () => {
  test("should let an admin replace another user's roles", async () => {
    const response = await request(app)
      .patch("/user/roles/noah@noah.com")
      .set("Cookie", adminCookie)
      .send({ roles: [Accounts.Editor.toString(), Accounts.Author.toString()] });

    showLog && console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      firstName: "Noah",
      lastName: expect.any(String),
      email: "noah@noah.com",
      roles: [Accounts.Editor.toString(), Accounts.Author.toString()],
    });

    const noah = await UsersAccessor.getUserByEmail("noah@noah.com");
    expect([...noah.roles]).toEqual([Accounts.Editor.toString(), Accounts.Author.toString()]);
  });

  test("should let an admin add and remove another admin", async () => {
    const promote = await request(app)
      .patch("/user/roles/noah@noah.com")
      .set("Cookie", adminCookie)
      .send({ roles: [Accounts.Editor.toString(), Accounts.Admin.toString()] });
    expect(promote.status).toBe(200);
    expect(promote.body.roles).toContain(Accounts.Admin.toString());

    const demote = await request(app)
      .patch("/user/roles/raisa@raisa.com")
      .set("Cookie", adminCookie)
      .send({ roles: [Accounts.Editor.toString()] });

    showLog && console.log(demote.body);
    expect(demote.status).toBe(200);
    expect(demote.body.roles).toEqual([Accounts.Editor.toString()]);
  });

  test("should remove duplicate roles", async () => {
    const response = await request(app)
      .patch("/user/roles/noah@noah.com")
      .set("Cookie", adminCookie)
      .send({ roles: [Accounts.Author.toString(), Accounts.Author.toString()] });

    showLog && console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body.roles).toEqual([Accounts.Author.toString()]);
  });

  test("should not let an admin change their own roles", async () => {
    const response = await request(app)
      .patch("/user/roles/ethan@ethan.com")
      .set("Cookie", adminCookie)
      .send({ roles: [Accounts.Admin.toString(), Accounts.Editor.toString()] });

    showLog && console.log(response.body);
    expect(response.status).toBe(403);

    const ethan = await UsersAccessor.getUserByEmail("ethan@ethan.com");
    expect([...ethan.roles]).toEqual([Accounts.Admin.toString()]);
  });

  test("should not let an admin change their own roles with different casing", async () => {
    const response = await request(app)
      .patch("/user/roles/Ethan@Ethan.com")
      .set("Cookie", adminCookie)
      .send({ roles: [Accounts.Editor.toString()] });

    showLog && console.log(response.body);
    expect(response.status).toBe(403);
  });

  test("should not let a non-admin change roles", async () => {
    const response = await request(app)
      .patch("/user/roles/vianna@vianna.com")
      .set("Cookie", editorCookie)
      .send({ roles: [Accounts.Admin.toString()] });

    showLog && console.log(response.body);
    expect(response.status).toBe(403);

    const vianna = await UsersAccessor.getUserByEmail("vianna@vianna.com");
    expect([...vianna.roles]).toEqual([Accounts.Designer.toString()]);
  });

  test("should not change roles when not logged in", async () => {
    const response = await request(app)
      .patch("/user/roles/vianna@vianna.com")
      .send({ roles: [Accounts.Admin.toString()] });

    showLog && console.log(response.body);
    expect(response.status).toBe(403);
  });

  test("should not allow an empty role list", async () => {
    const response = await request(app).patch("/user/roles/noah@noah.com").set("Cookie", adminCookie).send({ roles: [] });

    showLog && console.log(response.body);
    expect(response.status).toBe(400);
  });

  test("should not allow invalid roles", async () => {
    for (const role of ["superuser", Accounts.None.toString()]) {
      const response = await request(app)
        .patch("/user/roles/noah@noah.com")
        .set("Cookie", adminCookie)
        .send({ roles: [role] });

      showLog && console.log(response.body);
      expect(response.status).toBe(400);
    }
  });

  test("should return 404 for an unknown user", async () => {
    const response = await request(app)
      .patch("/user/roles/nobody@northeastern.edu")
      .set("Cookie", adminCookie)
      .send({ roles: [Accounts.Author.toString()] });

    showLog && console.log(response.body);
    expect(response.status).toBe(404);
  });
});

describe("Get User Role List Tests", () => {
  test("should list approved users with only their name, email, and roles", async () => {
    const response = await request(app).get("/user/list/roles").set("Cookie", adminCookie);

    showLog && console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(9);
    for (const user of response.body) {
      expect(Object.keys(user).sort()).toEqual(["email", "firstName", "lastName", "roles"]);
    }

    const emails = response.body.map((user) => user.email);
    expect(emails).toContain("ethan@ethan.com");
    // Pending users are left out
    expect(emails).not.toContain("kayla@kayla.com");
  });

  test("should sort users by last name", async () => {
    const response = await request(app).get("/user/list/roles").set("Cookie", adminCookie);

    const lastNames = response.body.map((user) => user.lastName);
    expect(lastNames).toEqual([...lastNames].sort((a, b) => a.localeCompare(b)));
  });

  test("should not let a non-admin list roles", async () => {
    const response = await request(app).get("/user/list/roles").set("Cookie", editorCookie);

    showLog && console.log(response.body);
    expect(response.status).toBe(403);
  });
});
