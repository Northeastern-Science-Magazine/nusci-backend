import request from "supertest";
import app from "../../../../app/app.js";
import tokens from "../../../testData/tokenTestData.js";
import { log } from "../../../testConfig.js";
import IssueMapAccessor from "../../../../app/databaseAccessors/issueMapAccessor.js";
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

describe("Add article to issue map", () => {
  /* In-file test data */
  const validArticleSlugFromIssue1 = "exploring-the-future-ai-integration-in-everyday-life";
  const articleObjectId = "a00000000000000000000000";

  const add = (body) =>
    request(app)
      .patch(`/issue-map/add-article`)
      .set("Cookie", [`token=${tokens["ethan@ethan.com"]}`])
      .send(body);

  test("should add an article that is not in any issue map", async () => {
    await IssueMapAccessor.removeArticleFromIssue(1, validArticleSlugFromIssue1);
    // also take it out of issue 1's section so it is in no issue map at all
    const issue1 = await IssueMapAccessor.getIssueMapByIssueNumber(1);
    issue1.sections.forEach((section) => section.articles.pull(articleObjectId));
    await issue1.save();

    const response = await add({ issueNumber: 2, articleSlug: validArticleSlugFromIssue1 });

    showLog && console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body.articles).toContain(articleObjectId);
    const article = await ArticlesAccessor.getArticleBySlug(validArticleSlugFromIssue1);
    expect(article.issueNumber).toBe(2);
  });

  test("Invalid add due to article already being in an issue map", async () => {
    const response = await add({ issueNumber: 2, articleSlug: validArticleSlugFromIssue1 });

    showLog && console.log(response.body);
    expect(response.status).toBe(404);
    expect(response.body.error).toStrictEqual("Invalid combination of article slug and issue number.");
  });

  test("Invalid add due to invalid slug (does not exist)", async () => {
    const response = await add({ issueNumber: 2, articleSlug: "invalid-article-slug" });

    showLog && console.log(response.body);
    expect(response.status).toBe(404);
    expect(response.body.error).toStrictEqual("Article not found.");
  });
});
