import request from "supertest";
import app from "../../../../app/app.js";
import tokens from "../../../testData/tokenTestData.js";
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

describe("Get all issue numbers", () => {
  /* In-file testing data */
  const adminToken = tokens["ethan@ethan.com"];

  test("Logged out user gets issue numbers, newest first", async () => {
    const response = await request(app).get("/issue-map/all-issue-numbers");
    showLog && console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual([2, 1]);
  });

  test("Created issue appears in the issue numbers", async () => {
    await request(app)
      .post("/issue-map/create")
      .set("Cookie", [`token=${adminToken}`])
      .send({ issueNumber: 5, issueName: "Spring 2027", pages: 40 });

    const response = await request(app).get("/issue-map/all-issue-numbers");
    showLog && console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual([5, 2, 1]);
  });
});
