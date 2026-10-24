import request from "supertest";
import app from "../../../../app/app.js";
import tokens from "../../../testData/tokenTestData.js";
import { log } from "../../../testConfig.js";
import ArticlesAccessor from "../../../../app/databaseAccessors/articleAccessor.js";
import { executeReset, injectMockConnection, closeMockConnection } from "../../../util/util.js";

const showLog = __filename
  .replace(".js", "")
  .split(/[/\\]/)
  .splice(__filename.split(/[/\\]/).lastIndexOf("__tests__") + 1)
  .reduce((acc, key) => acc && acc[key], log);
beforeEach(injectMockConnection);
beforeEach(executeReset);
afterAll(closeMockConnection);

describe("Update issue map", () => {
  /* In-file testing data */
  const adminToken = tokens["ethan@ethan.com"];
  const editorToken = tokens["noah@noah.com"];
  const issue1ArticleSlug = "exploring-the-future-ai-integration-in-everyday-life";

  const updateIssue = (issueNumber, body, token = adminToken) =>
    request(app)
      .patch(`/issue-map/${issueNumber}`)
      .set("Cookie", [`token=${token}`])
      .send(body);

  test("Admin updates name and pages", async () => {
    const response = await updateIssue(2, { issueName: "Winter 2026", pages: 48 });
    showLog && console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body.issueNumber).toBe(2);
    expect(response.body.issueName).toBe("Winter 2026");
    expect(response.body.pages).toBe(48);
  });

  test("Renumbering an issue moves its articles to the new number", async () => {
    const response = await updateIssue(1, { issueNumber: 50 });
    showLog && console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body.issueNumber).toBe(50);
    const article = await ArticlesAccessor.getArticleBySlug(issue1ArticleSlug);
    expect(article.issueNumber).toBe(50);
  });

  test("Keeping the same number and name is allowed", async () => {
    const response = await updateIssue(1, { issueNumber: 1, issueName: "Meeting with Team", pages: 6 });
    showLog && console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body.pages).toBe(6);
  });

  test("Renumbering onto an existing issue is rejected", async () => {
    const response = await updateIssue(1, { issueNumber: 2 });
    showLog && console.log(response.body);
    expect(response.status).toBe(409);
    expect(response.body.message).toBe("Issue #2 already exists.");
  });

  test("Renaming to an existing issue name is rejected", async () => {
    const response = await updateIssue(1, { issueName: "Club Holiday Party" });
    showLog && console.log(response.body);
    expect(response.status).toBe(409);
    expect(response.body.message).toBe('An issue named "Club Holiday Party" already exists.');
  });

  test("Updating a missing issue returns not found", async () => {
    const response = await updateIssue(999, { pages: 1 });
    showLog && console.log(response.body);
    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Issue #999 does not exist.");
  });

  test.each([{}, { issueName: "  " }, { pages: -1 }, { issueNumber: 0 }])("Invalid body is rejected: %o", async (body) => {
    const response = await updateIssue(1, body);
    showLog && console.log(response.body);
    expect(response.status).toBe(400);
  });

  test("Non-admin cannot update an issue", async () => {
    const response = await updateIssue(1, { pages: 1 }, editorToken);
    showLog && console.log(response.body);
    expect(response.status).toBe(403);
  });
});
