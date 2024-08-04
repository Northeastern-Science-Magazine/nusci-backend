import { execSync } from "child_process";
import request from "supertest";
import app from "../../../../app/app.js";
import Connection from "../../../../app/db/connection.js";
import { log } from "../../../testConfig.js";
import { validUsernameQueryRaisa, validUsernameQueryEthan } from "../../../testData/userTestData.js";

const showLog = __filename
  .replace(".js", "")
  .split(/[/\\]/)
  .splice(__filename.split(/[/\\]/).lastIndexOf("__tests__") + 1)
  .reduce((acc, key) => acc && acc[key], log);

beforeAll(async () => {
  await Connection.open(true);
});

afterAll(async () => {
  await Connection.close(true);
});

beforeEach(async () => {
  execSync("npm run reset-s", { stdio: "ignore" });
});

describe("Get User By Username Tests", () => {
  test("get a user by a valid/existing username raisa", async () => {
    const response = await request(app).get("/user/username/raisa");

    showLog && console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual(validUsernameQueryRaisa);
    expect(response.body.username).toBe("raisa");
  });

  test("get a user by a valid/existing username ethan", async () => {
    const response = await request(app).get("/user/username/ethan");

    showLog && console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual(validUsernameQueryEthan);
    expect(response.body.username).toBe("ethan");
  });

  test("attempt getting an invalid username", async () => {
    const response = await request(app).get("/user/username/nonexistentuser");

    showLog && console.log(response.body);
    expect(response.body).toStrictEqual({ error: "User not found." });
    expect(response.status).toBe(404);
  });
});
