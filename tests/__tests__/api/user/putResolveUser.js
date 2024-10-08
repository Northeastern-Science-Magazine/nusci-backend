import { execSync } from "child_process";
import request from "supertest";
import app from "../../../../app/app.js";
import Connection from "../../../../app/db/connection.js";
import { log } from "../../../testConfig.js";
import tokens from "../../../testData/tokenTestData.js";

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

    showLog && console.log(response.body);
    expect(response.status).toBe(201);
    expect(response.body).toStrictEqual({ message: "All users resolved successfully." });
  });

  // add second deny user
  test("test only denying users", async () => {
    const listOfUsers = {
      approve: [],
      deny: ["fdallis", "amartinez"],
    };

    const response = await request(app)
      .put("/user/resolve-status")
      .send(listOfUsers)
      .set("Cookie", [`token=${tokens.ethan}`]);

    showLog && console.log(response.body);
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

    showLog && console.log(response.body);
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

    showLog && console.log(response.body);
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

    showLog && console.log(response.body);
    expect(response.status).toBe(404);
    expect(response.body).toStrictEqual({ error: "User not found.", message: "" });
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

    showLog && console.log(response.body);
    expect(response.status).toBe(404);
    expect(response.body).toStrictEqual({ error: "User not found.", message: "" });
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

    showLog && console.log(response.body);
    expect(response.status).toBe(404);
    expect(response.body).toStrictEqual({ error: "User not found.", message: "" });
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

    showLog && console.log(response.body);
    expect(response.status).toBe(404);
    expect(response.body).toStrictEqual({ error: "User not found.", message: "" });
  });
});
