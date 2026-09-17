import request from "supertest";
import app from "../../../../app/app.js";
import { log } from "../../../testConfig.js";
import tokens from "../../../testData/tokenTestData.js";
import { executeReset, injectMockConnection, closeMockConnection } from "../../../util/util.js";

const showLog = __filename
  .replace(".js", "")
  .split(/[/\\]/)
  .splice(__filename.split(/[/\\]/).lastIndexOf("__tests__") + 1)
  .reduce((acc, key) => acc && acc[key], log);
beforeEach(injectMockConnection);
beforeEach(executeReset);
afterAll(closeMockConnection);

describe("Update own profile tests", () => {
  test("update own profile with valid fields", async () => {
    const update = {
      major: "Data Science",
      location: "Cambridge",
      bio: "Updated bio",
    };

    const response = await request(app)
      .patch("/user/me")
      .send(update)
      .set("Cookie", [`token=${tokens["ethan@ethan.com"]}`]);

    showLog && console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject(update);
    expect(response.body.email).toBe("ethan@ethan.com");
    expect(response.body.password).toBeUndefined();
  });

  test("reject update when not logged in", async () => {
    const response = await request(app).patch("/user/me").send({ major: "Data Science" });

    showLog && console.log(response.body);
    expect(response.status).toBe(403);
  });

  test("ignores attempts to self-escalate roles, status, approvingUser, or email", async () => {
    const response = await request(app)
      .patch("/user/me")
      .send({
        location: "Cambridge",
        roles: ["admin"],
        status: "approved",
        approvingUser: "000000000000000000000000",
        email: "vianna@newemail.com",
      })
      .set("Cookie", [`token=${tokens["vianna@vianna.com"]}`]);

    showLog && console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body.location).toBe("Cambridge");
    expect(response.body.roles).toStrictEqual(["designer"]);
    expect(response.body.email).toBe("vianna@vianna.com");
  });
});
