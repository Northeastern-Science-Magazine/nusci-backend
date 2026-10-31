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

describe("Move article between issue maps", () => {
  /* In-file test data */
  const validArticleSlugFromIssue1 = "exploring-the-future-ai-integration-in-everyday-life";
  const invalidArticleSlug = "invalid-article-slug";
  const articleObjectIdsInIssue1AfterMove = ["a00000000000000000000001", "a00000000000000000000002"];
  const articleObjectIdsInIssue2AfterMove = [
    "a00000000000000000000003",
    "a00000000000000000000004",
    "a00000000000000000000005",
    "a00000000000000000000000",
  ];
  const articleObjectIdsInIssue1Unchanged = [
    "a00000000000000000000000",
    "a00000000000000000000001",
    "a00000000000000000000002",
  ];

  test("should successfully move article to another issue map", async () => {
    const requestBody = {
      issueNumber: 2,
      articleSlug: validArticleSlugFromIssue1,
    };

    const response = await request(app)
      .patch(`/issue-map/move-article`)
      .set("Cookie", [`token=${tokens["ethan@ethan.com"]}`])
      .send(requestBody);

    showLog && console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body.articles).toStrictEqual(articleObjectIdsInIssue2AfterMove);
  });

  test("should remove the article from its original issue map and update its issue number", async () => {
    const requestBody = {
      issueNumber: 2,
      articleSlug: validArticleSlugFromIssue1,
    };

    const response = await request(app)
      .patch(`/issue-map/move-article`)
      .set("Cookie", [`token=${tokens["ethan@ethan.com"]}`])
      .send(requestBody);
    expect(response.status).toBe(200);

    const originalIssue = await IssueMapAccessor.getIssueMapByIssueNumber(1);
    const movedArticle = await ArticlesAccessor.getArticleBySlug(validArticleSlugFromIssue1);

    showLog && console.log(originalIssue, movedArticle);
    expect(originalIssue.articles.map(String)).toStrictEqual(articleObjectIdsInIssue1AfterMove);
    expect(movedArticle.issueNumber).toBe(2);
  });

  test("should leave the issue map unchanged when moving an article to the issue it is already in", async () => {
    const requestBody = {
      issueNumber: 1,
      articleSlug: validArticleSlugFromIssue1,
    };

    const response = await request(app)
      .patch(`/issue-map/move-article`)
      .set("Cookie", [`token=${tokens["ethan@ethan.com"]}`])
      .send(requestBody);

    showLog && console.log(response);
    expect(response.status).toBe(200);
    expect(response.body.articles).toStrictEqual(articleObjectIdsInIssue1Unchanged);
  });

  test("Invalid article move due to invalid destination issue number", async () => {
    const requestBody = {
      issueNumber: 999,
      articleSlug: validArticleSlugFromIssue1,
    };

    const response = await request(app)
      .patch(`/issue-map/move-article`)
      .set("Cookie", [`token=${tokens["ethan@ethan.com"]}`])
      .send(requestBody);

    showLog && console.log(response);
    expect(response.status).toBe(404);
    const errorMessage = JSON.parse(response.text).error;
    expect(errorMessage).toStrictEqual("Issue Map not found.");

    //the article must not have been removed from its original issue
    const originalIssue = await IssueMapAccessor.getIssueMapByIssueNumber(1);
    expect(originalIssue.articles.map(String)).toStrictEqual(articleObjectIdsInIssue1Unchanged);
  });

  test("Invalid article move due to invalid slug (does not exist)", async () => {
    const requestBody = {
      issueNumber: 2,
      articleSlug: invalidArticleSlug,
    };

    const response = await request(app)
      .patch(`/issue-map/move-article`)
      .set("Cookie", [`token=${tokens["ethan@ethan.com"]}`])
      .send(requestBody);

    showLog && console.log(response);
    expect(response.status).toBe(404);
    const errorMessage = JSON.parse(response.text).error;
    expect(errorMessage).toStrictEqual("Article not found.");
  });

  test("should move an article that is not in any issue map into the given issue", async () => {
    await IssueMapAccessor.removeArticleFromIssue(1, validArticleSlugFromIssue1);

    const response = await request(app)
      .patch(`/issue-map/move-article`)
      .set("Cookie", [`token=${tokens["ethan@ethan.com"]}`])
      .send({ issueNumber: 2, articleSlug: validArticleSlugFromIssue1 });

    showLog && console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body.articles).toStrictEqual(articleObjectIdsInIssue2AfterMove);
    const movedArticle = await ArticlesAccessor.getArticleBySlug(validArticleSlugFromIssue1);
    expect(movedArticle.issueNumber).toBe(2);
  });

  test("should remove the article from its original issue map's sections", async () => {
    const response = await request(app)
      .patch(`/issue-map/move-article`)
      .set("Cookie", [`token=${tokens["ethan@ethan.com"]}`])
      .send({ issueNumber: 2, articleSlug: validArticleSlugFromIssue1 });
    expect(response.status).toBe(200);

    const originalIssue = await IssueMapAccessor.getIssueMapByIssueNumber(1);
    showLog && console.log(originalIssue.sections);
    expect(originalIssue.sections.flatMap((section) => section.articles.map(String))).not.toContain(
      "a00000000000000000000000"
    );
  });

  test("Invalid article move due to empty request body", async () => {
    const response = await request(app)
      .patch(`/issue-map/move-article`)
      .set("Cookie", [`token=${tokens["ethan@ethan.com"]}`])
      .send({});

    showLog && console.log(response);
    expect(response.status).toBe(404);
    const errorMessage = JSON.parse(response.text).error;
    expect(errorMessage).toStrictEqual("Invalid request body.");
  });

  test("Invalid article move due to missing article slug", async () => {
    const response = await request(app)
      .patch(`/issue-map/move-article`)
      .set("Cookie", [`token=${tokens["ethan@ethan.com"]}`])
      .send({ issueNumber: 2 });

    showLog && console.log(response);
    expect(response.status).toBe(404);
    const errorMessage = JSON.parse(response.text).error;
    expect(errorMessage).toStrictEqual("Invalid request body.");
  });

  test("Invalid article move due to missing issue number", async () => {
    const response = await request(app)
      .patch(`/issue-map/move-article`)
      .set("Cookie", [`token=${tokens["ethan@ethan.com"]}`])
      .send({ articleSlug: validArticleSlugFromIssue1 });

    showLog && console.log(response);
    expect(response.status).toBe(404);
    const errorMessage = JSON.parse(response.text).error;
    expect(errorMessage).toStrictEqual("Invalid request body.");
  });

  test("Invalid article move due to invalid permissions", async () => {
    const response = await request(app)
      .patch(`/issue-map/move-article`)
      .set("Cookie", [`token=${tokens["vianna@vianna.com"]}`])
      .send({ issueNumber: 2, articleSlug: validArticleSlugFromIssue1 });

    showLog && console.log(response);
    expect(response.status).toBe(403);
    expect(response.body.error).toBeDefined();
  });
});