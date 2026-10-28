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

describe("Update Article Sources", () => {
  /* In-file test data */
  const validArticleSlug = "exploring-the-future-ai-integration-in-everyday-life";
  const invalidArticleSlug = "invalid-article-slug";
  const validSourcesUpdate = {
    sources: [
      { text: "Nature", href: "https://www.nature.com" },
      { text: "Interview with the author", href: null },
    ],
  };

  test("should update article sources successfully", async () => {
    const response = await request(app)
      .patch(`/articles/sources/${validArticleSlug}`)
      .set("Cookie", [`token=${tokens["ethan@ethan.com"]}`])
      .send(validSourcesUpdate);

    showLog && console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body.sources).toEqual(validSourcesUpdate.sources);
  });

  test("should update article sources successfully as an editor", async () => {
    const response = await request(app)
      .patch(`/articles/sources/${validArticleSlug}`)
      .set("Cookie", [`token=${tokens["noah@noah.com"]}`])
      .send(validSourcesUpdate);

    showLog && console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body.sources).toEqual(validSourcesUpdate.sources);
  });

  test("should update article sources successfully as an author", async () => {
    const response = await request(app)
      .patch(`/articles/sources/${validArticleSlug}`)
      .set("Cookie", [`token=${tokens["jasmine@jasmine.com"]}`])
      .send(validSourcesUpdate);

    showLog && console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body.sources).toEqual(validSourcesUpdate.sources);
  });

  test("should update article sources to an empty list", async () => {
    const response = await request(app)
      .patch(`/articles/sources/${validArticleSlug}`)
      .set("Cookie", [`token=${tokens["ethan@ethan.com"]}`])
      .send({ sources: [] });

    showLog && console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body.sources).toEqual([]);
  });

  test("should only change the sources and modification time, leaving the rest of the article intact", async () => {
    const before = await request(app).get(`/articles/slug/${validArticleSlug}`);

    const response = await request(app)
      .patch(`/articles/sources/${validArticleSlug}`)
      .set("Cookie", [`token=${tokens["ethan@ethan.com"]}`])
      .send(validSourcesUpdate);
    expect(response.status).toBe(200);

    const after = await request(app).get(`/articles/slug/${validArticleSlug}`);

    showLog && console.log(after.body);
    expect(after.body.sources.map(({ text, href }) => ({ text, href }))).toEqual(validSourcesUpdate.sources);
    expect(after.body.title).toBe(before.body.title);
    expect(after.body.slug).toBe(before.body.slug);
    expect(after.body.articleContent).toEqual(before.body.articleContent);
    expect(after.body.categories).toEqual(before.body.categories);
    expect(after.body.authors).toEqual(before.body.authors);
    expect(new Date(after.body.modificationTime).getTime()).toBeGreaterThan(
      new Date(before.body.modificationTime).getTime()
    );
  });

  test("should fail to update article sources due to missing sources", async () => {
    const response = await request(app)
      .patch(`/articles/sources/${validArticleSlug}`)
      .set("Cookie", [`token=${tokens["ethan@ethan.com"]}`])
      .send({});

    showLog && console.log(response.body);
    expect(response.status).toBe(400);
    expect(response.body.error).toBeDefined();
  });

  test("should fail to update article sources due to sources not being a list", async () => {
    const response = await request(app)
      .patch(`/articles/sources/${validArticleSlug}`)
      .set("Cookie", [`token=${tokens["ethan@ethan.com"]}`])
      .send({ sources: "Nature" });

    showLog && console.log(response.body);
    expect(response.status).toBe(400);
    expect(response.body.error).toBeDefined();
  });

  test("should fail to update article sources due to a source missing its text", async () => {
    const response = await request(app)
      .patch(`/articles/sources/${validArticleSlug}`)
      .set("Cookie", [`token=${tokens["ethan@ethan.com"]}`])
      .send({ sources: [{ href: "https://www.nature.com" }] });

    showLog && console.log(response.body);
    expect(response.status).toBe(400);
    expect(response.body.error).toBeDefined();
  });

  test("should fail to update article sources due to a source link that is not a string", async () => {
    const response = await request(app)
      .patch(`/articles/sources/${validArticleSlug}`)
      .set("Cookie", [`token=${tokens["ethan@ethan.com"]}`])
      .send({ sources: [{ text: "Nature", href: 123 }] });

    showLog && console.log(response.body);
    expect(response.status).toBe(400);
    expect(response.body.error).toBeDefined();
  });

  test("should fail to update article sources due to invalid article slug", async () => {
    const response = await request(app)
      .patch(`/articles/sources/${invalidArticleSlug}`)
      .set("Cookie", [`token=${tokens["ethan@ethan.com"]}`])
      .send(validSourcesUpdate);

    showLog && console.log(response.body);
    expect(response.status).toBe(404);
    expect(response.body.error).toBeDefined();
  });

  test("should fail to update article sources due to invalid permissions", async () => {
    const response = await request(app)
      .patch(`/articles/sources/${validArticleSlug}`)
      .set("Cookie", [`token=${tokens["vianna@vianna.com"]}`])
      .send(validSourcesUpdate);

    showLog && console.log(response.body);
    expect(response.status).toBe(403);
    expect(response.body.error).toBeDefined();
  });

  test("should fail to update article sources when not logged in", async () => {
    const response = await request(app).patch(`/articles/sources/${validArticleSlug}`).send(validSourcesUpdate);

    showLog && console.log(response.body);
    expect(response.status).toBe(403);
    expect(response.body.error).toBeDefined();
  });
});