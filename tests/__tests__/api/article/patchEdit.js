import request from "supertest";
import app from "../../../../app/app.js";
import tokens from "../../../testData/tokenTestData.js";
import { log } from "../../../testConfig.js";
import ArticleContent from "../../../../app/models/enums/articleContent.js";
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

describe("Edit Article", () => {
  /* In-file test data */
  const validArticleSlug = "exploring-the-future-ai-integration-in-everyday-life";
  const invalidArticleSlug = "invalid-article-slug";
  const articleObjectId = "a00000000000000000000000";
  const validEdit = {
    title: "Exploring the Future: A Revised Title",
    articleContent: [
      [{ contentType: ArticleContent.Text.type, content: "This is the first revised paragraph." }],
      [{ contentType: ArticleContent.PullQuote.type, content: "This is a revised pull quote." }],
    ],
    authors: ["anika@anika.com", "jasmine@jasmine.com"],
    categories: ["Physics", "Space"],
    sources: [
      { text: "Nature", href: "https://www.nature.com" },
      { text: "Interview with the author", href: null },
    ],
  };

  const edit = (body, token, slug = validArticleSlug) => {
    const req = request(app).patch(`/articles/edit/${slug}`);
    if (token) req.set("Cookie", [`token=${tokens[token]}`]);
    return req.send(body);
  };

  test("should edit an article successfully as an admin", async () => {
    const response = await edit({ title: validEdit.title }, "ethan@ethan.com");

    showLog && console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body.title).toBe(validEdit.title);
  });

  test("should edit an article successfully as an editor", async () => {
    const response = await edit({ title: validEdit.title }, "noah@noah.com");

    showLog && console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body.title).toBe(validEdit.title);
  });

  test("should edit several fields at once, leaving the slug intact", async () => {
    const before = await request(app).get(`/articles/slug/${validArticleSlug}`);

    const response = await edit(validEdit, "ethan@ethan.com");
    showLog && console.log(response.body);
    expect(response.status).toBe(200);

    const after = await request(app).get(`/articles/slug/${validArticleSlug}`);
    expect(after.body.slug).toBe(before.body.slug);
    expect(after.body.title).toBe(validEdit.title);
    expect(after.body.categories).toEqual(validEdit.categories);
    expect(after.body.sources).toMatchObject(validEdit.sources);
    expect(after.body.articleContent.map((p) => p.map(({ contentType, content }) => ({ contentType, content })))).toEqual(
      validEdit.articleContent
    );
    expect(after.body.authors.map((a) => a.email)).toEqual(validEdit.authors);
    expect(new Date(after.body.modificationTime).getTime()).toBeGreaterThan(
      new Date(before.body.modificationTime).getTime()
    );
  });

  test("should move the article between issue maps", async () => {
    const response = await edit({ issueNumber: 2 }, "ethan@ethan.com");
    expect(response.status).toBe(200);
    expect(response.body.issueNumber).toBe(2);

    const originalIssue = await IssueMapAccessor.getIssueMapByIssueNumber(1);
    const destinationIssue = await IssueMapAccessor.getIssueMapByIssueNumber(2);

    showLog && console.log(originalIssue, destinationIssue);
    expect(originalIssue.articles.map(String)).not.toContain(articleObjectId);
    expect(destinationIssue.articles.map(String)).toContain(articleObjectId);
  });

  test.each([
    ["an empty body", {}],
    ["an unknown field", { articleStatus: "Print" }],
    ["an invalid category", { categories: ["Physics", "Not A Category"] }],
    ["empty categories", { categories: [] }],
    ["an empty title", { title: "  " }],
    ["a non-positive issue number", { issueNumber: 0 }],
    ["a non-integer issue number", { issueNumber: 1.5 }],
    ["an issue number that is not a number", { issueNumber: "2" }],
  ])("should fail to edit an article due to %s", async (_, body) => {
    const response = await edit(body, "ethan@ethan.com");

    showLog && console.log(response.body);
    expect(response.status).toBe(400);
    expect(response.body.error).toBeDefined();
  });

  test("should fail to edit an article due to invalid article slug", async () => {
    const response = await edit({ title: validEdit.title }, "ethan@ethan.com", invalidArticleSlug);

    showLog && console.log(response.body);
    expect(response.status).toBe(404);
    expect(response.body.error).toBeDefined();
  });

  test("should fail to edit an article due to an unknown author", async () => {
    const response = await edit({ authors: ["invalidUsername"] }, "ethan@ethan.com");

    showLog && console.log(response.body);
    expect(response.status).toBe(404);
    expect(response.body.error).toBeDefined();
  });

  test("should fail to edit an article due to an issue map that does not exist, writing nothing", async () => {
    const response = await edit({ title: validEdit.title, issueNumber: 999 }, "ethan@ethan.com");

    showLog && console.log(response.body);
    expect(response.status).toBe(404);
    expect(response.body.error).toBeDefined();

    const originalIssue = await IssueMapAccessor.getIssueMapByIssueNumber(1);
    expect(originalIssue.articles.map(String)).toContain(articleObjectId);
    const after = await request(app).get(`/articles/slug/${validArticleSlug}`);
    expect(after.body.title).not.toBe(validEdit.title);
  });

  test.each([
    ["an author", "jasmine@jasmine.com"],
    ["a designer", "vianna@vianna.com"],
    ["a logged out user", undefined],
  ])("should fail to edit an article due to invalid permissions as %s", async (_, token) => {
    const response = await edit({ title: validEdit.title }, token);

    showLog && console.log(response.body);
    expect(response.status).toBe(403);
    expect(response.body.error).toBeDefined();
  });
});
