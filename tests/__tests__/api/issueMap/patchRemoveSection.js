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

describe("Remove section from issue map", () => {
  test("Remove section with no articles in section", async () => {
    const requestBody = {
      issueNumber: 1,
      sectionName: "Psychology",
      sectionColor: "red",
    };

    const response = await request(app)
        .patch(`/issue-map/remove-section`).send(requestBody);

    showLog && console.log(response);
    expect(response.status).toBe(404);
    expect(response.body.articles).toStrictEqual(articleObjectIdAfterIssue1Removal);
  });
  test("Remove section with multiple articles in section", async () => {});
  test("Remove section with no matching section name ", async () => {});
  test("Remove section with no matching color", async () => {});
  test("Remove section with matching color and section name, but not in the correct issue number", async () => {});
});
