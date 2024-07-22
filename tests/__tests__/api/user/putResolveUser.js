import { execSync } from "child_process";
import request from "supertest";
import app from "../../../../app/app.js";
import Connection from "../../../../app/db/connection.js";
import logTestSuite from "../../../util.js";
import tokens from "../../../testData/tokenTestData.js";

afterAll(async () => {
  await Connection.close(!logTestSuite);
});

beforeEach(async () => {
  execSync("npm run reset-s", { stdio: "inherit" });
});

describe("Approve or deny given users test", () => {
  test("test only approving users", async () => {
    const listOfUsers = {
      approve: ["ace", "dhoward"],
      deny: [],
    };

    const response = await request(app)
      .put("/user/resolve-status")
      .send(listOfUsers)
      .set("Cookie", [`token=${tokens.ethan}`]);

    logTestSuite.user && console.log(response.body);
    expect(response.status).toBe(201);
    expect(response.body).toStrictEqual({ message: "All users resolved successfully." });
  });

  test("test only denying users", async () => {
    const listOfUsers = {
      approve: [],
      deny: ["newuser", "fdallis"],
    };

    const response = await request(app)
      .put("/user/resolve-status")
      .send(listOfUsers)
      .set("Cookie", [`token=${tokens.ethan}`]);

    logTestSuite.user && console.log(response.body);
    expect(response.status).toBe(201);
    expect(response.body).toStrictEqual({ message: "All users resolved successfully." });
  });

  test("test approving and denying users", async () => {
    const listOfUsers = {
      approve: ["ejohnson", "msmith"],
      deny: ["cbrown", "jdavis"],
    };

    const response = await request(app)
      .put("/user/resolve-status")
      .send(listOfUsers)
      .set("Cookie", [`token=${tokens.ethan}`]);

    logTestSuite.user && console.log(response.body);
    expect(response.status).toBe(201);
    expect(response.body).toStrictEqual({ message: "All users resolved successfully." });
  });

  test("test empty lists for approving and denying users", async () => {
    const listOfUsers = {
      approve: [],
      deny: [],
    };

    const response = await request(app)
      .put("/user/resolve-status")
      .send(listOfUsers)
      .set("Cookie", [`token=${tokens.ethan}`]);

    logTestSuite.user && console.log(response.body);
    expect(response.status).toBe(201);
    expect(response.body).toStrictEqual({ message: "All users resolved successfully." });
  });

  test("test approving users that doesn't exists", async () => {
    const listOfUsers = {
      approve: ["nonexistentuser1", "nonexistentuser2"],
      deny: [],
    };

    const response = await request(app)
      .put("/user/resolve-status")
      .send(listOfUsers)
      .set("Cookie", [`token=${tokens.ethan}`]);

    logTestSuite.user && console.log(response.body);
    expect(response.status).toBe(404);
    expect(response.body).toStrictEqual({ error: "User not found." });
  });

  test("test denying users that doesn't exists", async () => {
    const listOfUsers = {
      approve: [],
      deny: ["nonexistentuser1", "nonexistentuser2"],
    };

    const response = await request(app)
      .put("/user/resolve-status")
      .send(listOfUsers)
      .set("Cookie", [`token=${tokens.ethan}`]);

    logTestSuite.user && console.log(response.body);
    expect(response.status).toBe(404);
    expect(response.body).toStrictEqual({ error: "User not found." });
  });

  test("test approving users where only some exists", async () => {
    const listOfUsers = {
      approve: ["dpatterson", "nonexistentuser1", "nonexistentuser2"],
      deny: [],
    };

    const response = await request(app)
      .put("/user/resolve-status")
      .send(listOfUsers)
      .set("Cookie", [`token=${tokens.ethan}`]);

    logTestSuite.user && console.log(response.body);
    expect(response.status).toBe(404);
    expect(response.body).toStrictEqual({ error: "User not found." });
  });

  test("test denying users where only some exists", async () => {
    const listOfUsers = {
      approve: [],
      deny: ["amartinez", "nonexistentuser1", "nonexistentuser2"],
    };

    const response = await request(app)
      .put("/user/resolve-status")
      .send(listOfUsers)
      .set("Cookie", [`token=${tokens.ethan}`]);

    logTestSuite.user && console.log(response.body);
    expect(response.status).toBe(404);
    expect(response.body).toStrictEqual({ error: "User not found." });
  });
});
