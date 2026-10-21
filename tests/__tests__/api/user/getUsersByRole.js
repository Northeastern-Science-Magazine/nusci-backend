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

const PRIVATE_FIELDS = ["password", "phone", "status", "approvingUser", "_id"];

describe("Get Users By Role Tests", () => {
  test("get approved admins, sorted by last name", async () => {
    const response = await request(app).get("/user/role/admin");

    showLog && console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual([userResponseRaisa, userResponseEthan]);
  });

  test("pending users are excluded (Kayla is a pending admin)", async () => {
    const response = await request(app).get("/user/role/admin");

    showLog && console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body.map((user) => user.email)).not.toContain("kayla@kayla.com");
  });

  test("get approved editors", async () => {
    const response = await request(app).get("/user/role/editor");

    showLog && console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body.map((user) => user.email)).toStrictEqual(["noah@noah.com", "nethra@nethra.com"]);
  });

  test("response contains no private fields", async () => {
    const response = await request(app).get("/user/role/editor");

    showLog && console.log(response.body);
    expect(response.status).toBe(200);
    response.body.forEach((user) => {
      PRIVATE_FIELDS.forEach((field) => expect(user).not.toHaveProperty(field));
    });
  });

  test("role is case insensitive", async () => {
    const response = await request(app).get("/user/role/ADMIN");

    showLog && console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual([userResponseRaisa, userResponseEthan]);
  });

  test("attempt getting an invalid role", async () => {
    const response = await request(app).get("/user/role/notarole");

    showLog && console.log(response.body);
    expect(response.status).toBe(400);
    expect(response.body).toStrictEqual({
      error: "A validation error occurred.",
      message: "Invalid Accounts enum given.",
    });
  });

  test("attempt getting the none role", async () => {
    const response = await request(app).get("/user/role/none");

    showLog && console.log(response.body);
    expect(response.status).toBe(400);
    expect(response.body).toStrictEqual({
      error: "A validation error occurred.",
      message: "Invalid Accounts enum given.",
    });
  });
});
