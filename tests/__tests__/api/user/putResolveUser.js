import request from "supertest";
import app from "../../../../app/app.js";
import { log } from "../../../testConfig.js";
import tokens from "../../../testData/tokenTestData.js";
import { executeReset, injectMockConnection, closeMockConnection } from "../../../util/util.js";

const showLog = __filename
  .replace(".js", "")
  .split(/[/\\]/)
  .splice(__filename.split(/[/\\]/).lastIndexOf("__tests__") + 1)
  .reduce((acc, key) => acc && acc[key], log);
beforeEach(injectMockConnection);
beforeEach(executeReset);
afterAll(closeMockConnection);

describe("Approve or deny given users test", () => {
  test("test only approving users", async () => {
    const listOfUsers = {
      approve: ["ace@ace.com", "dylan@howard.com"],
      deny: [],
    };

    const response = await request(app)
      .put("/user/resolve-status")
      .send(listOfUsers)
      .set("Cookie", [`token=${tokens["ethan@ethan.com"]}`]);

    showLog && console.log(response.body);
    expect(response.status).toBe(201);
    expect(response.body).toStrictEqual({ message: "All users resolved successfully." });
  });

  // add second deny user
  test("test only denying users", async () => {
    const listOfUsers = {
      approve: [],
      deny: ["anika@anika.com", "michael@smith.com"],
    };

    const response = await request(app)
      .put("/user/resolve-status")
      .send(listOfUsers)
      .set("Cookie", [`token=${tokens["ethan@ethan.com"]}`]);

    showLog && console.log(response.body);
    expect(response.status).toBe(201);
    expect(response.body).toStrictEqual({ message: "All users resolved successfully." });
  });

  test("test approving and denying users", async () => {
    const listOfUsers = {
      approve: ["ace@ace.com", "dylan@howard.com"],
      deny: ["anika@anika.com", "michael@smith.com"],
    };

    const response = await request(app)
      .put("/user/resolve-status")
      .send(listOfUsers)
      .set("Cookie", [`token=${tokens["ethan@ethan.com"]}`]);

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
      .set("Cookie", [`token=${tokens["ethan@ethan.com"]}`]);

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
      .set("Cookie", [`token=${tokens["ethan@ethan.com"]}`]);

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
      .set("Cookie", [`token=${tokens["ethan@ethan.com"]}`]);

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
      .set("Cookie", [`token=${tokens["ethan@ethan.com"]}`]);

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
      .set("Cookie", [`token=${tokens["ethan@ethan.com"]}`]);

    showLog && console.log(response.body);
    expect(response.status).toBe(404);
    expect(response.body).toStrictEqual({ error: "User not found.", message: "" });
  });
});
