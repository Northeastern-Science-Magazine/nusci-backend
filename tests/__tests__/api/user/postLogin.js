import request from "supertest";
import app from "../../../../app/app.js";
import { log } from "../../../testConfig.js";
import { executeReset, injectMockConnection, closeMockConnection } from "../../../util/util.js";

const showLog = __filename
  .replace(".js", "")
  .split(/[/\\]/)
  .splice(__filename.split(/[/\\]/).lastIndexOf("__tests__") + 1)
  .reduce((acc, key) => acc && acc[key], log);
beforeEach(injectMockConnection);
beforeEach(executeReset);
afterAll(closeMockConnection);

describe("User Login Tests", () => {
  test("should login a valid user Raisa", async () => {
    const response = await request(app).post("/user/login").send({
      email: "raisa@raisa.com",
      password: "raisa",
    });

    showLog && console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Login successful.");
    expect(response.headers["set-cookie"]).toBeDefined();
  });

  test("should login a valid user Ethan", async () => {
    const response = await request(app).post("/user/login").send({
      email: "ethan@ethan.com",
      password: "123",
    });

    showLog && console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Login successful.");
    expect(response.headers["set-cookie"]).toBeDefined();
  });

  test("should not login with incorrect password for Ethan", async () => {
    const response = await request(app).post("/user/login").send({
      email: "ethan@ethan.com",
      password: "321",
    });

    showLog && console.log(response.body);
    expect(response.status).toBe(400);
  });

  test("should not login with incorrect password for Raisa", async () => {
    const response = await request(app).post("/user/login").send({
      email: "raisa@raisa.com",
      password: "notraisa",
    });

    showLog && console.log(response.body);
    expect(response.status).toBe(400);
  });

  test("should not login with non-existent", async () => {
    const response = await request(app)
      .post("/user/login")
      .send({
        email: ["nonexistentuser@d.com"],
        password: "password",
      });

    showLog && console.log(response.body);
    expect(response.status).toBe(400);
  });

  test("should not login if user is unapproved", async () => {
    const response = await request(app).post("/user/login").send({
      email: "ace@ace.com",
      password: "sparky",
    });

    showLog && console.log(response.body);
    expect(response.status).toBe(400);
  });
});
