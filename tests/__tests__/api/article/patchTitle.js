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

describe("Update Article Title", () => {
  /* In-file test data */
  const validArticleSlug = "exploring-the-future-ai-integration-in-everyday-life";
  const invalidArticleSlug = "invalid-article-slug";
  const validTitleUpdate = { title: "Exploring the Future: A Revised Title" };

  test("should update article title successfully", async () => {
    const response = await request(app)
      .patch(`/articles/title/${validArticleSlug}`)
      .set("Cookie", [`token=${tokens["ethan@ethan.com"]}`])
      .send(validTitleUpdate);

    showLog && console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body.title).toBe(validTitleUpdate.title);
  });

  test("should update article title successfully as an editor", async () => {
    const response = await request(app)
      .patch(`/articles/title/${validArticleSlug}`)
      .set("Cookie", [`token=${tokens["noah@noah.com"]}`])
      .send(validTitleUpdate);

    showLog && console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body.title).toBe(validTitleUpdate.title);
  });

  test("should update article title successfully as an author", async () => {
    const response = await request(app)
      .patch(`/articles/title/${validArticleSlug}`)
      .set("Cookie", [`token=${tokens["jasmine@jasmine.com"]}`])
      .send(validTitleUpdate);

    showLog && console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body.title).toBe(validTitleUpdate.title);
  });

  test("should only change the title and modification time, leaving the rest of the article intact", async () => {
    const before = await request(app).get(`/articles/slug/${validArticleSlug}`);

    const response = await request(app)
      .patch(`/articles/title/${validArticleSlug}`)
      .set("Cookie", [`token=${tokens["ethan@ethan.com"]}`])
      .send(validTitleUpdate);
    expect(response.status).toBe(200);

    const after = await request(app).get(`/articles/slug/${validArticleSlug}`);

    showLog && console.log(after.body);
    expect(after.body.title).toBe(validTitleUpdate.title);
    expect(after.body.slug).toBe(before.body.slug);
    expect(after.body.articleContent).toEqual(before.body.articleContent);
    expect(after.body.authors).toEqual(before.body.authors);
    expect(new Date(after.body.modificationTime).getTime()).toBeGreaterThan(
      new Date(before.body.modificationTime).getTime()
    );
  });

  test("should fail to update article title due to missing title", async () => {
    const response = await request(app)
      .patch(`/articles/title/${validArticleSlug}`)
      .set("Cookie", [`token=${tokens["ethan@ethan.com"]}`])
      .send({});

    showLog && console.log(response.body);
    expect(response.status).toBe(400);
    expect(response.body.error).toBeDefined();
  });

  test("should fail to update article title due to blank title", async () => {
    const response = await request(app)
      .patch(`/articles/title/${validArticleSlug}`)
      .set("Cookie", [`token=${tokens["ethan@ethan.com"]}`])
      .send({ title: "   " });

    showLog && console.log(response.body);
    expect(response.status).toBe(400);
    expect(response.body.error).toBeDefined();
  });

  test("should fail to update article title due to invalid article slug", async () => {
    const response = await request(app)
      .patch(`/articles/title/${invalidArticleSlug}`)
      .set("Cookie", [`token=${tokens["ethan@ethan.com"]}`])
      .send(validTitleUpdate);

    showLog && console.log(response.body);
    expect(response.status).toBe(404);
    expect(response.body.error).toBeDefined();
  });

  test("should fail to update article title due to invalid permissions", async () => {
    const response = await request(app)
      .patch(`/articles/title/${validArticleSlug}`)
      .set("Cookie", [`token=${tokens["vianna@vianna.com"]}`])
      .send(validTitleUpdate);

    showLog && console.log(response.body);
    expect(response.status).toBe(403);
    expect(response.body.error).toBeDefined();
  });

  test("should fail to update article title when not logged in", async () => {
    const response = await request(app).patch(`/articles/title/${validArticleSlug}`).send(validTitleUpdate);

    showLog && console.log(response.body);
    expect(response.status).toBe(403);
    expect(response.body.error).toBeDefined();
  });
});