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

describe("Update Article Issue Number", () => {
  /* In-file test data */
  const validArticleSlug = "exploring-the-future-ai-integration-in-everyday-life";
  const invalidArticleSlug = "invalid-article-slug";
  const articleObjectId = "a00000000000000000000000";
  const validIssueNumberUpdate = { issueNumber: 2 };

  test("should update article issue number successfully", async () => {
    const response = await request(app)
      .patch(`/articles/issue-number/${validArticleSlug}`)
      .set("Cookie", [`token=${tokens["ethan@ethan.com"]}`])
      .send(validIssueNumberUpdate);

    showLog && console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body.issueNumber).toBe(validIssueNumberUpdate.issueNumber);
  });

  test("should update article issue number successfully as an editor", async () => {
    const response = await request(app)
      .patch(`/articles/issue-number/${validArticleSlug}`)
      .set("Cookie", [`token=${tokens["noah@noah.com"]}`])
      .send(validIssueNumberUpdate);

    showLog && console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body.issueNumber).toBe(validIssueNumberUpdate.issueNumber);
  });

  test("should move the article between issue maps", async () => {
    const response = await request(app)
      .patch(`/articles/issue-number/${validArticleSlug}`)
      .set("Cookie", [`token=${tokens["ethan@ethan.com"]}`])
      .send(validIssueNumberUpdate);
    expect(response.status).toBe(200);

    const originalIssue = await IssueMapAccessor.getIssueMapByIssueNumber(1);
    const destinationIssue = await IssueMapAccessor.getIssueMapByIssueNumber(2);

    showLog && console.log(originalIssue, destinationIssue);
    expect(originalIssue.articles.map(String)).not.toContain(articleObjectId);
    expect(destinationIssue.articles.map(String)).toContain(articleObjectId);
  });

  test("should leave the article in its issue map when given the issue it is already in", async () => {
    const response = await request(app)
      .patch(`/articles/issue-number/${validArticleSlug}`)
      .set("Cookie", [`token=${tokens["ethan@ethan.com"]}`])
      .send({ issueNumber: 1 });

    const issue = await IssueMapAccessor.getIssueMapByIssueNumber(1);

    showLog && console.log(response.body, issue);
    expect(response.status).toBe(200);
    expect(issue.articles.map(String)).toContain(articleObjectId);
  });

  test("should fail to update article issue number due to missing issue number", async () => {
    const response = await request(app)
      .patch(`/articles/issue-number/${validArticleSlug}`)
      .set("Cookie", [`token=${tokens["ethan@ethan.com"]}`])
      .send({});

    showLog && console.log(response.body);
    expect(response.status).toBe(400);
    expect(response.body.error).toBeDefined();
  });

  test("should fail to update article issue number due to a non-positive issue number", async () => {
    const response = await request(app)
      .patch(`/articles/issue-number/${validArticleSlug}`)
      .set("Cookie", [`token=${tokens["ethan@ethan.com"]}`])
      .send({ issueNumber: 0 });

    showLog && console.log(response.body);
    expect(response.status).toBe(400);
    expect(response.body.error).toBeDefined();
  });

  test("should fail to update article issue number due to a non-integer issue number", async () => {
    const response = await request(app)
      .patch(`/articles/issue-number/${validArticleSlug}`)
      .set("Cookie", [`token=${tokens["ethan@ethan.com"]}`])
      .send({ issueNumber: 1.5 });

    showLog && console.log(response.body);
    expect(response.status).toBe(400);
    expect(response.body.error).toBeDefined();
  });

  test("should fail to update article issue number due to issue number not being a number", async () => {
    const response = await request(app)
      .patch(`/articles/issue-number/${validArticleSlug}`)
      .set("Cookie", [`token=${tokens["ethan@ethan.com"]}`])
      .send({ issueNumber: "2" });

    showLog && console.log(response.body);
    expect(response.status).toBe(400);
    expect(response.body.error).toBeDefined();
  });

  test("should fail to update article issue number due to an issue map that does not exist", async () => {
    const response = await request(app)
      .patch(`/articles/issue-number/${validArticleSlug}`)
      .set("Cookie", [`token=${tokens["ethan@ethan.com"]}`])
      .send({ issueNumber: 999 });

    showLog && console.log(response.body);
    expect(response.status).toBe(404);
    expect(response.body.error).toBeDefined();

    //the article must not have been removed from its original issue
    const originalIssue = await IssueMapAccessor.getIssueMapByIssueNumber(1);
    expect(originalIssue.articles.map(String)).toContain(articleObjectId);
  });

  test("should fail to update article issue number due to invalid article slug", async () => {
    const response = await request(app)
      .patch(`/articles/issue-number/${invalidArticleSlug}`)
      .set("Cookie", [`token=${tokens["ethan@ethan.com"]}`])
      .send(validIssueNumberUpdate);

    showLog && console.log(response.body);
    expect(response.status).toBe(404);
    expect(response.body.error).toBeDefined();
  });

  test("should fail to update article issue number due to the article not being in any issue map", async () => {
    await request(app)
      .patch(`/issue-map/remove-article`)
      .set("Cookie", [`token=${tokens["ethan@ethan.com"]}`])
      .send({ issueNumber: 1, articleSlug: validArticleSlug });

    const response = await request(app)
      .patch(`/articles/issue-number/${validArticleSlug}`)
      .set("Cookie", [`token=${tokens["ethan@ethan.com"]}`])
      .send(validIssueNumberUpdate);

    showLog && console.log(response.body);
    expect(response.status).toBe(404);
    expect(response.body.error).toBeDefined();
  });

  test("should fail to update article issue number due to invalid permissions as an author", async () => {
    const response = await request(app)
      .patch(`/articles/issue-number/${validArticleSlug}`)
      .set("Cookie", [`token=${tokens["jasmine@jasmine.com"]}`])
      .send(validIssueNumberUpdate);

    showLog && console.log(response.body);
    expect(response.status).toBe(403);
    expect(response.body.error).toBeDefined();
  });

  test("should fail to update article issue number due to invalid permissions as a designer", async () => {
    const response = await request(app)
      .patch(`/articles/issue-number/${validArticleSlug}`)
      .set("Cookie", [`token=${tokens["vianna@vianna.com"]}`])
      .send(validIssueNumberUpdate);

    showLog && console.log(response.body);
    expect(response.status).toBe(403);
    expect(response.body.error).toBeDefined();
  });

  test("should fail to update article issue number when not logged in", async () => {
    const response = await request(app)
      .patch(`/articles/issue-number/${validArticleSlug}`)
      .send(validIssueNumberUpdate);

    showLog && console.log(response.body);
    expect(response.status).toBe(403);
    expect(response.body.error).toBeDefined();
  });
});