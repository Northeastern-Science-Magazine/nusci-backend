import request from "supertest";
import app from "../../../../app/app.js";
import tokens from "../../../testData/tokenTestData.js";
import { log } from "../../../testConfig.js";
import IssueMapAccessor from "../../../../app/databaseAccessors/issueMapAccessor.js";
import { executeReset, injectMockConnection, closeMockConnection } from "../../../util/util.js";

const showLog = __filename
  .replace(".js", "")
  .split(/[/\\]/)
  .splice(__filename.split(/[/\\]/).lastIndexOf("__tests__") + 1)
  .reduce((acc, key) => acc && acc[key], log);
beforeEach(injectMockConnection);
beforeEach(executeReset);
afterAll(closeMockConnection);

describe("Get issue count", () => {
  /* In-file testing data */
  const adminToken = tokens["ethan@ethan.com"];

  test("Logged out user gets the number of issues with articles", async () => {
    const response = await request(app).get("/issue-map/count");
    showLog && console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual({ count: 2 });
  });

  test("Issue with no articles is not counted", async () => {
    await request(app)
      .post("/issue-map/create")
      .set("Cookie", [`token=${adminToken}`])
      .send({ issueNumber: 5, issueName: "Spring 2027", pages: 40 });

    const response = await request(app).get("/issue-map/count");
    showLog && console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual({ count: 2 });
  });

  test("Issue stops being counted once its articles are removed", async () => {
    await IssueMapAccessor.updateIssue(1, { articles: [] });

    const response = await request(app).get("/issue-map/count");
    showLog && console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual({ count: 1 });
  });
});
