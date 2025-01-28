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

describe("User sign up flow", () => {
  test("User sign up, log in, and request profile", async () => {
    const response = await request(app).get("/");
  });
  
  test("User sign up", async () => {
    const response = await request(app)
      .post("/api/user/postSignup")
      .send({ username: "testuser", password: "testpass" });

    if (response.status !== 201) {
      console.error("Sign up failed:", response.body);
    }

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("message", "User created successfully");
  });

  test("User log in", async () => {
    const response = await request(app)
      .post("/api/user/postLogin")
      .send({ username: "testuser", password: "testpass" });

    if (response.status !== 200) {
      console.error("Login failed:", response.body);
    }

    expect(response.status).toBe(200);
  });
});
