import request from "supertest";
import app from "../../../../app/app.js";
import tokens from "../../../testData/tokenTestData.js";
import { log } from "../../../testConfig.js";
import ArticleContent from "../../../../app/models/enums/articleContent.js";
import ArticleStatus from "../../../../app/models/enums/articleStatus.js";
import WritingStatus from "../../../../app/models/enums/writingStatus.js";
import DesignStatus from "../../../../app/models/enums/designStatus.js";
import PhotographyStatus from "../../../../app/models/enums/photographyStatus.js";
import { executeReset, injectMockConnection, closeMockConnection } from "../../../util/util.js";

const showLog = __filename
  .replace(".js", "")
  .split(/[/\\]/)
  .splice(__filename.split(/[/\\]/).lastIndexOf("__tests__") + 1)
  .reduce((acc, key) => acc && acc[key], log);
beforeEach(injectMockConnection);
beforeEach(executeReset);
afterAll(closeMockConnection);

describe("Create Article", () => {
  /* In-file test data */
  const validArticle = {
    title: "A Brand New Article",
    slug: "a-brand-new-article",
    issueNumber: 1,
    categories: ["Physics"],
    articleContent: [[{ contentType: ArticleContent.Text.type, content: "The first paragraph." }]],
    sources: [{ text: "Nature", href: "https://www.nature.com" }],
    pageLength: 2,
    comments: [],
    articleStatus: ArticleStatus.Pending.status,
    writingStatus: WritingStatus.Has_Editor.status,
    designStatus: DesignStatus.Has_Designer.status,
    photographyStatus: PhotographyStatus.Photographer_Assigned.status,
    authors: ["jasmine@jasmine.com", "anika@anika.com"],
    editors: ["noah@noah.com"],
    photographers: ["jiajia@jiajia.com"],
    designers: ["vianna@vianna.com"],
  };

  const create = (body, token) => {
    const req = request(app).post("/articles/create");
    if (token) req.set("Cookie", [`token=${tokens[token]}`]);
    return req.send(body);
  };

  test.each([
    ["an admin", "ethan@ethan.com"],
    ["an editor", "noah@noah.com"],
  ])("should create an article successfully as %s", async (_, token) => {
    const response = await create(validArticle, token);

    showLog && console.log(response.body);
    expect(response.status).toBe(201);
    expect(response.body.slug).toBe(validArticle.slug);
    for (const field of ["authors", "editors", "photographers", "designers"]) {
      expect(response.body[field]).toHaveLength(validArticle[field].length);
    }
    expect(response.body.creationTime).toBeDefined();
  });

  test("should store every reference field as the matching users", async () => {
    const response = await create(validArticle, "ethan@ethan.com");
    expect(response.status).toBe(201);

    const saved = await request(app).get(`/articles/slug/${validArticle.slug}`);
    showLog && console.log(saved.body);
    expect(saved.status).toBe(200);
    for (const field of ["authors", "editors", "photographers", "designers"]) {
      expect(saved.body[field].map((user) => user.email)).toEqual(validArticle[field]);
    }
  });

  test("should create an article with no editors, photographers, or designers", async () => {
    const { editors, photographers, designers, ...article } = validArticle;
    const response = await create(article, "ethan@ethan.com");

    showLog && console.log(response.body);
    expect(response.status).toBe(201);
  });

  test.each([
    ["null", null],
    ["empty", []],
  ])("should create an article with %s editors, photographers, and designers", async (_, value) => {
    const article = { ...validArticle, editors: value, photographers: value, designers: value };
    const response = await create(article, "ethan@ethan.com");

    showLog && console.log(response.body);
    expect(response.status).toBe(201);

    const saved = await request(app).get(`/articles/slug/${validArticle.slug}`);
    expect(saved.status).toBe(200);
    for (const field of ["editors", "photographers", "designers"]) {
      expect(saved.body[field] ?? []).toEqual([]);
    }
  });

  test("should accept a valid email repeated in the same field", async () => {
    const response = await create({ ...validArticle, authors: ["jasmine@jasmine.com", "jasmine@jasmine.com"] }, "ethan@ethan.com");

    showLog && console.log(response.body);
    expect(response.status).toBe(201);
    expect(response.body.authors).toHaveLength(2);
  });

  test.each([
    ["an author", "authors", "jasmine@jasmine.com"],
    ["an editor", "editors", "noah@noah.com"],
    ["a photographer", "photographers", "jiajia@jiajia.com"],
    ["a designer", "designers", "vianna@vianna.com"],
  ])("should fail when %s does not exist", async (_, field, existing) => {
    const response = await create({ ...validArticle, [field]: [existing, "nobody@nowhere.com"] }, "ethan@ethan.com");

    showLog && console.log(response.body);
    expect(response.status).toBe(400);
    expect(response.body.error).toBeDefined();
  });

  test.each([
    ["an author", "authors", "noah@noah.com"],
    ["an editor", "editors", "jasmine@jasmine.com"],
    ["a photographer", "photographers", "vianna@vianna.com"],
    ["a designer", "designers", "jiajia@jiajia.com"],
  ])("should fail when %s does not have the matching role", async (_, field, wrongUser) => {
    const response = await create({ ...validArticle, [field]: [wrongUser] }, "ethan@ethan.com");

    showLog && console.log(response.body);
    expect(response.status).toBe(400);
    expect(response.body.error).toBeDefined();
  });

  test("should not create the article when a reference field is invalid", async () => {
    await create({ ...validArticle, designers: ["nobody@nowhere.com"] }, "ethan@ethan.com");

    const saved = await request(app).get(`/articles/slug/${validArticle.slug}`);
    expect(saved.status).toBe(404);
  });

  test("should fail to create an article with a slug that already exists", async () => {
    const response = await create(
      { ...validArticle, slug: "exploring-the-future-ai-integration-in-everyday-life" },
      "ethan@ethan.com"
    );

    showLog && console.log(response.body);
    expect(response.status).toBe(409);
    expect(response.body.message).toContain("exploring-the-future-ai-integration-in-everyday-life");
  });

  test("should fail to create an article with an empty content segment", async () => {
    const response = await create(
      { ...validArticle, articleContent: [[{ contentType: ArticleContent.Text.type, content: "" }]] },
      "ethan@ethan.com"
    );

    showLog && console.log(response.body);
    expect(response.status).toBe(400);
  });

  test("should fail to create an article with malformed data", async () => {
    const { title, ...article } = validArticle;
    const response = await create(article, "ethan@ethan.com");

    showLog && console.log(response.body);
    expect(response.status).toBe(400);
    expect(response.body.error).toBeDefined();
  });

  test.each([
    ["an author", "jasmine@jasmine.com"],
    ["a developer", "sutton@sutton.com"],
  ])("should fail to create an article as %s", async (_, token) => {
    const response = await create(validArticle, token);

    showLog && console.log(response.body);
    expect(response.status).toBe(403);
    expect(response.body.error).toBeDefined();
  });

  test("should fail to create an article without logging in", async () => {
    const response = await create(validArticle);

    showLog && console.log(response.body);
    expect(response.status).toBe(403);
    expect(response.body.error).toBeDefined();
  });
});
