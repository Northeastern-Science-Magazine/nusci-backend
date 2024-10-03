import { execSync } from "child_process";
import request from "supertest";
import app from "../../../../app/app.js";
import Connection from "../../../../app/db/connection.js";
import { log } from "../../../testConfig.js";
import { validEmailQueryRaisa, validEmailQueryEthan } from "../../../testData/userTestData.js";

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

describe("Get User By Email Tests", () => {
  test("get a user by a valid/existing email (Raisa)", async () => {
    const response = await request(app).get("/user/email/raisa@raisa.com");

    showLog && console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual(validEmailQueryRaisa);
  });

  test("get a user by a valid/existing email (Ethan)", async () => {
    const response = await request(app).get("/user/email/ethan%40ethan.com");

    showLog && console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual(validEmailQueryEthan);
  });

  test("attempt getting an invalid email", async () => {
    const response = await request(app).get("/user/email/nonexistentuser");

    showLog && console.log(response.body);
    expect(response.body).toStrictEqual({ error: "User not found.", message: "" });
    expect(response.status).toBe(404);
  });
});
