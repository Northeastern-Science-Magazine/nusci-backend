import request from "supertest";
import app from "../../../../app/app.js";
import ArticleContent from "../../../../app/models/enums/articleContent.js";
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

describe("Update Article Content", () => {
  /* In-file test data */
  const validArticleSlug = "exploring-the-future-ai-integration-in-everyday-life";
  const invalidArticleSlug = "invalid-article-slug";
  const validContentUpdate = {
    articleContent: [
      [{ contentType: ArticleContent.Text.type, content: "This is the first revised paragraph." }],
      [{ contentType: ArticleContent.PullQuote.type, content: "This is a revised pull quote." }],
      [{ contentType: ArticleContent.Text.type, content: "This is the last revised paragraph." }],
    ],
  };
  const invalidContentTypeUpdate = {
    articleContent: [[{ contentType: "unknown_content_type", content: "Some content." }]],
  };
  const flatContentUpdate = {
    articleContent: [{ contentType: ArticleContent.Text.type, content: "Missing the surrounding block." }],
  };

  test("should update article content successfully", async () => {
    const response = await request(app)
      .patch(`/articles/content/${validArticleSlug}`)
      .set("Cookie", [`token=${tokens["ethan@ethan.com"]}`])
      .send(validContentUpdate);

    showLog && console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body.articleContent).toEqual(validContentUpdate.articleContent);
  });

  test("should update article content successfully as an editor", async () => {
    const response = await request(app)
      .patch(`/articles/content/${validArticleSlug}`)
      .set("Cookie", [`token=${tokens["noah@noah.com"]}`])
      .send(validContentUpdate);

    showLog && console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body.articleContent).toEqual(validContentUpdate.articleContent);
  });

  test("should update article content successfully as an author", async () => {
    const response = await request(app)
      .patch(`/articles/content/${validArticleSlug}`)
      .set("Cookie", [`token=${tokens["jasmine@jasmine.com"]}`])
      .send(validContentUpdate);

    showLog && console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body.articleContent).toEqual(validContentUpdate.articleContent);
  });

  test("should only change the content and modification time, leaving the rest of the article intact", async () => {
    const before = await request(app).get(`/articles/slug/${validArticleSlug}`);

    const response = await request(app)
      .patch(`/articles/content/${validArticleSlug}`)
      .set("Cookie", [`token=${tokens["ethan@ethan.com"]}`])
      .send(validContentUpdate);
    expect(response.status).toBe(200);

    const after = await request(app).get(`/articles/slug/${validArticleSlug}`);

    showLog && console.log(after.body);
    expect(after.body.articleContent).toEqual(validContentUpdate.articleContent);
    expect(after.body.title).toBe(before.body.title);
    expect(after.body.slug).toBe(before.body.slug);
    expect(after.body.authors).toEqual(before.body.authors);
    expect(new Date(after.body.modificationTime).getTime()).toBeGreaterThan(
      new Date(before.body.modificationTime).getTime()
    );
  });

  test("should fail to update article content due to missing content", async () => {
    const response = await request(app)
      .patch(`/articles/content/${validArticleSlug}`)
      .set("Cookie", [`token=${tokens["ethan@ethan.com"]}`])
      .send({});

    showLog && console.log(response.body);
    expect(response.status).toBe(400);
    expect(response.body.error).toBeDefined();
  });

  test("should fail to update article content due to invalid content type", async () => {
    const response = await request(app)
      .patch(`/articles/content/${validArticleSlug}`)
      .set("Cookie", [`token=${tokens["ethan@ethan.com"]}`])
      .send(invalidContentTypeUpdate);

    showLog && console.log(response.body);
    expect(response.status).toBe(400);
    expect(response.body.error).toBeDefined();
  });

  test("should fail to update article content due to malformed content structure", async () => {
    const response = await request(app)
      .patch(`/articles/content/${validArticleSlug}`)
      .set("Cookie", [`token=${tokens["ethan@ethan.com"]}`])
      .send(flatContentUpdate);

    showLog && console.log(response.body);
    expect(response.status).toBe(400);
    expect(response.body.error).toBeDefined();
  });

  test("should fail to update article content due to invalid article slug", async () => {
    const response = await request(app)
      .patch(`/articles/content/${invalidArticleSlug}`)
      .set("Cookie", [`token=${tokens["ethan@ethan.com"]}`])
      .send(validContentUpdate);

    showLog && console.log(response.body);
    expect(response.status).toBe(404);
    expect(response.body.error).toBeDefined();
  });

  test("should fail to update article content due to invalid permissions", async () => {
    const response = await request(app)
      .patch(`/articles/content/${validArticleSlug}`)
      .set("Cookie", [`token=${tokens["vianna@vianna.com"]}`])
      .send(validContentUpdate);

    showLog && console.log(response.body);
    expect(response.status).toBe(403);
    expect(response.body.error).toBeDefined();
  });

  test("should fail to update article content when not logged in", async () => {
    const response = await request(app).patch(`/articles/content/${validArticleSlug}`).send(validContentUpdate);

    showLog && console.log(response.body);
    expect(response.status).toBe(403);
    expect(response.body.error).toBeDefined();
  });
});