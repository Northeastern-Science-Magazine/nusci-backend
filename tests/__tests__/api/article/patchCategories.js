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

describe("Update Article Categories", () => {
  /* In-file test data */
  const validArticleSlug = "exploring-the-future-ai-integration-in-everyday-life";
  const invalidArticleSlug = "invalid-article-slug";
  const validCategoriesUpdate = { categories: ["Physics", "Space"] };

  test("should update article categories successfully", async () => {
    const response = await request(app)
      .patch(`/articles/categories/${validArticleSlug}`)
      .set("Cookie", [`token=${tokens["ethan@ethan.com"]}`])
      .send(validCategoriesUpdate);

    showLog && console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body.categories).toEqual(validCategoriesUpdate.categories);
  });

  test("should update article categories successfully as an editor", async () => {
    const response = await request(app)
      .patch(`/articles/categories/${validArticleSlug}`)
      .set("Cookie", [`token=${tokens["noah@noah.com"]}`])
      .send(validCategoriesUpdate);

    showLog && console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body.categories).toEqual(validCategoriesUpdate.categories);
  });

  test("should update article categories successfully as an author", async () => {
    const response = await request(app)
      .patch(`/articles/categories/${validArticleSlug}`)
      .set("Cookie", [`token=${tokens["jasmine@jasmine.com"]}`])
      .send(validCategoriesUpdate);

    showLog && console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body.categories).toEqual(validCategoriesUpdate.categories);
  });

  test("should only change the categories and modification time, leaving the rest of the article intact", async () => {
    const before = await request(app).get(`/articles/slug/${validArticleSlug}`);

    const response = await request(app)
      .patch(`/articles/categories/${validArticleSlug}`)
      .set("Cookie", [`token=${tokens["ethan@ethan.com"]}`])
      .send(validCategoriesUpdate);
    expect(response.status).toBe(200);

    const after = await request(app).get(`/articles/slug/${validArticleSlug}`);

    showLog && console.log(after.body);
    expect(after.body.categories).toEqual(validCategoriesUpdate.categories);
    expect(after.body.title).toBe(before.body.title);
    expect(after.body.slug).toBe(before.body.slug);
    expect(after.body.articleContent).toEqual(before.body.articleContent);
    expect(after.body.sources).toEqual(before.body.sources);
    expect(after.body.authors).toEqual(before.body.authors);
    expect(new Date(after.body.modificationTime).getTime()).toBeGreaterThan(
      new Date(before.body.modificationTime).getTime()
    );
  });

  test("should fail to update article categories due to missing categories", async () => {
    const response = await request(app)
      .patch(`/articles/categories/${validArticleSlug}`)
      .set("Cookie", [`token=${tokens["ethan@ethan.com"]}`])
      .send({});

    showLog && console.log(response.body);
    expect(response.status).toBe(400);
    expect(response.body.error).toBeDefined();
  });

  test("should fail to update article categories due to an empty list", async () => {
    const response = await request(app)
      .patch(`/articles/categories/${validArticleSlug}`)
      .set("Cookie", [`token=${tokens["ethan@ethan.com"]}`])
      .send({ categories: [] });

    showLog && console.log(response.body);
    expect(response.status).toBe(400);
    expect(response.body.error).toBeDefined();
  });

  test("should fail to update article categories due to an invalid category", async () => {
    const response = await request(app)
      .patch(`/articles/categories/${validArticleSlug}`)
      .set("Cookie", [`token=${tokens["ethan@ethan.com"]}`])
      .send({ categories: ["Physics", "Not A Category"] });

    showLog && console.log(response.body);
    expect(response.status).toBe(400);
    expect(response.body.error).toBeDefined();
  });

  test("should fail to update article categories due to categories not being a list", async () => {
    const response = await request(app)
      .patch(`/articles/categories/${validArticleSlug}`)
      .set("Cookie", [`token=${tokens["ethan@ethan.com"]}`])
      .send({ categories: "Physics" });

    showLog && console.log(response.body);
    expect(response.status).toBe(400);
    expect(response.body.error).toBeDefined();
  });

  test("should fail to update article categories due to invalid article slug", async () => {
    const response = await request(app)
      .patch(`/articles/categories/${invalidArticleSlug}`)
      .set("Cookie", [`token=${tokens["ethan@ethan.com"]}`])
      .send(validCategoriesUpdate);

    showLog && console.log(response.body);
    expect(response.status).toBe(404);
    expect(response.body.error).toBeDefined();
  });

  test("should fail to update article categories due to invalid permissions", async () => {
    const response = await request(app)
      .patch(`/articles/categories/${validArticleSlug}`)
      .set("Cookie", [`token=${tokens["vianna@vianna.com"]}`])
      .send(validCategoriesUpdate);

    showLog && console.log(response.body);
    expect(response.status).toBe(403);
    expect(response.body.error).toBeDefined();
  });

  test("should fail to update article categories when not logged in", async () => {
    const response = await request(app).patch(`/articles/categories/${validArticleSlug}`).send(validCategoriesUpdate);

    showLog && console.log(response.body);
    expect(response.status).toBe(403);
    expect(response.body.error).toBeDefined();
  });
});