import request from "supertest";
import app from "../../../../app/app.js";
import { log } from "../../../testConfig.js";
import { executeReset, injectMockConnection, closeMockConnection } from "../../../util/util.js";
import { userResponseRaisa, userResponseEthan } from "../../../testData/userTestData.js";

const showLog = __filename
  .replace(".js", "")
  .split(/[/\\]/)
  .splice(__filename.split(/[/\\]/).lastIndexOf("__tests__") + 1)
  .reduce((acc, key) => acc && acc[key], log);
beforeEach(injectMockConnection);
beforeEach(executeReset);
afterAll(closeMockConnection);

describe("Get User By Email Tests", () => {
  test("get a user by a valid/existing email (Raisa)", async () => {
    const response = await request(app).get("/user/email/raisa%40raisa.com");

    showLog && console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual(userResponseRaisa);
  });

  test("get a user by a valid/existing email (Ethan)", async () => {
    const response = await request(app).get("/user/email/ethan%40ethan.com");

    showLog && console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual(userResponseEthan);
  });

  test("attempt getting an invalid email", async () => {
    const response = await request(app).get("/user/email/nonexistentuser%40nonexistent.com");

    showLog && console.log(response.body);
    expect(response.body).toStrictEqual({ error: "User not found.", message: "" });
    expect(response.status).toBe(404);
  });
});
