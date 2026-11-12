import request from "supertest";
import app from "../../../../app/app.js";
import tokens from "../../../testData/tokenTestData.js";
import { log } from "../../../testConfig.js";
import ArticlesAccessor from "../../../../app/databaseAccessors/articleAccessor.js";
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

describe("Delete Article", () => {
  /* In-file test data */
  const slugA = "exploring-the-future-ai-integration-in-everyday-life";
  const slugB = "discovery-of-ancient-flying-machine-leaves-scientists-baffled";
  const invalidSlug = "invalid-article-slug";
  const articleIdA = "a00000000000000000000000";
  const articleIdB = "a00000000000000000000003";

  const del = (slug, token) => {
    const req = request(app).delete(`/articles/delete/${slug}`);
    if (token) req.set("Cookie", ["token=" + tokens[token]]);
    return req;
  };

  const issueMapContains = (issueMap, articleId) => {
    if (!issueMap) return false;
    const inArticles = (issueMap.articles ?? []).some((id) => id.toString() === articleId);
    const inSections = (issueMap.sections ?? []).some((section) =>
      (section.articles ?? []).some((id) => id.toString() === articleId)
    );
    return inArticles || inSections;
  };

  test("should delete an article as an admin and remove it from its issue map", async () => {
    // before: the article exists and issue 1 references it
    expect(await ArticlesAccessor.getArticleBySlug(slugA)).not.toBeNull();
    expect(issueMapContains(await IssueMapAccessor.getIssueMapByIssueNumber(1), articleIdA)).toBe(true);

    const response = await del(slugA, "ethan@ethan.com");

    showLog && console.log(response.body);
    expect(response.status).toBe(204);

    // the article is gone
    expect(await ArticlesAccessor.getArticleBySlug(slugA)).toBeNull();
    const getResponse = await request(app).get(`/articles/slug/${slugA}`);
    expect(getResponse.status).toBe(404);

    // and no issue map references it anymore, top level or in a section,
    // while the issue's other articles are untouched
    const issueMap = await IssueMapAccessor.getIssueMapByIssueNumber(1);
    expect(issueMapContains(issueMap, articleIdA)).toBe(false);
    expect(issueMapContains(issueMap, "a00000000000000000000001")).toBe(true);
  });

  test("should delete a second article as an admin and clean its issue map", async () => {
    expect(issueMapContains(await IssueMapAccessor.getIssueMapByIssueNumber(2), articleIdB)).toBe(true);

    const response = await del(slugB, "raisa@raisa.com");

    showLog && console.log(response.body);
    expect(response.status).toBe(204);
    expect(await ArticlesAccessor.getArticleBySlug(slugB)).toBeNull();
    expect(issueMapContains(await IssueMapAccessor.getIssueMapByIssueNumber(2), articleIdB)).toBe(false);
  });

  test("should return 404 when deleting an article that does not exist", async () => {
    const response = await del(invalidSlug, "ethan@ethan.com");

    showLog && console.log(response.body);
    expect(response.status).toBe(404);
    expect(response.body.error).toBe("Article not found.");
  });

  test("should not delete an article as an editor", async () => {
    const response = await del(slugA, "noah@noah.com");

    showLog && console.log(response.body);
    expect(response.status).toBe(403);
    expect(await ArticlesAccessor.getArticleBySlug(slugA)).not.toBeNull();
  });

  test("should not delete an article when not logged in", async () => {
    const response = await del(slugA);

    showLog && console.log(response.body);
    expect(response.status).toBe(403);
    expect(await ArticlesAccessor.getArticleBySlug(slugA)).not.toBeNull();
  });
});
