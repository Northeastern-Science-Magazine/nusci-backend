import { execSync } from "child_process";
import request from "supertest";
import app from "../../../../app/app.js";
import Connection from "../../../../app/db/connection.js";
import { log } from "../../../testConfig.js";
import {
  validUserLoginRaisa,
  validUserLoginEthan,
  invalidUserLoginEthan,
  invalidUserLoginRaisa,
  pendingUserLoginAce,
} from "../../../testData/userTestData.js";

const showLog =
  log[__filename.split("/")[__filename.split("/").length - 3]][__filename.split("/")[__filename.split("/").length - 2]][
    __filename.split("/")[__filename.split("/").length - 1].slice(0, -3)
  ];

beforeAll(async () => {
  await Connection.open(true);
});

afterAll(async () => {
  await Connection.close(true);
});

beforeEach(async () => {
  execSync("npm run reset-s", { stdio: "ignore" });
});

describe("User Login Tests", () => {
  test("should login a valid user Raisa", async () => {
    const response = await request(app).post("/user/login").send(validUserLoginRaisa);

    showLog && console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Login successful");
    expect(response.headers["set-cookie"]).toBeDefined();
  });

  test("should login a valid user Ethan", async () => {
    const response = await request(app).post("/user/login").send(validUserLoginEthan);

    showLog && console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Login successful");
    expect(response.headers["set-cookie"]).toBeDefined();
  });

  test("should not login with incorrect password for Ethan", async () => {
    const response = await request(app).post("/user/login").send(invalidUserLoginEthan);

    showLog && console.log(response.body);
    expect(response.status).toBe(400);
  });

  test("should not login with incorrect password for Raisa", async () => {
    const response = await request(app).post("/user/login").send(invalidUserLoginRaisa);

    showLog && console.log(response.body);
    expect(response.status).toBe(400);
  });

  test("should not login with non-existent username", async () => {
    const response = await request(app).post("/user/login").send({
      username: "nonexistentuser",
      password: "password",
    });

    showLog && console.log(response.body);
    expect(response.status).toBe(404);
  });

  test("should not login if user is unapproved", async () => {
    const response = await request(app).post("/user/login").send(pendingUserLoginAce);

    showLog && console.log(response.body);
    expect(response.status).toBe(400);
  });
});
