import request from "supertest";
import app from "../../../../app/app.js";
import { log } from "../../../testConfig.js";
import { executeReset, injectMockConnection, closeMockConnection } from "../../../util/util.js";
import { userResponseArushi, userResponseRaisa, userResponseEthan } from "../../../testData/userTestData.js";
import User from "../../../../app/models/dbModels/user.js";
import AccountStatus from "../../../../app/models/enums/accountStatus.js";

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
  // Kayla is a pending admin, so this also checks that non-approved users are excluded
  test("get approved admins, sorted by last name", async () => {
    const response = await request(app).get("/user/role/admin");

    showLog && console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual([userResponseArushi, userResponseRaisa, userResponseEthan]);
  });

  test("an invalid stored user is skipped instead of failing the listing", async () => {
    // insert through the raw collection so mongoose validation doesn't block the bad email
    await User.collection.insertOne({
      ...userResponseEthan,
      firstName: "Bad",
      lastName: "Email",
      email: "not-an-email",
      creationTime: new Date(userResponseEthan.creationTime),
      modificationTime: new Date(userResponseEthan.modificationTime),
      password: "password",
      status: AccountStatus.Approved.status,
    });

    const response = await request(app).get("/user/role/admin");

    showLog && console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual([userResponseArushi, userResponseRaisa, userResponseEthan]);
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
    expect(response.body).toStrictEqual([userResponseArushi, userResponseRaisa, userResponseEthan]);
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
