import request from "supertest";
import app from "../../../../app/app.js";
import { log } from "../../../testConfig.js";
import ArticleContent from "../../../../app/models/enums/articleContent.js";
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
  const existingArticleSlug = "exploring-the-future-ai-integration-in-everyday-life";
  const validArticle = {
    title: "A Brand New Article",
    slug: "a-brand-new-article",
    issueNumber: null,
    categories: ["Physics"],
    articleContent: [[{ contentType: ArticleContent.Text.type, content: "First paragraph." }]],
    sources: [],
    pageLength: 1,
    comments: [],
    articleStatus: "print",
    writingStatus: "eic_approved",
    designStatus: "completed",
    photographyStatus: "no_photo",
    authors: ["anika@anika.com"],
    editors: [],
    designers: [],
    photographers: [],
  };

  const create = (body) => request(app).post("/articles/create").send(body);

  test("should create an article and save it", async () => {
    const response = await create(validArticle);

    showLog && console.log(response.body);
    expect(response.status).toBe(200);

    const saved = await request(app).get(`/articles/slug/${validArticle.slug}`);
    expect(saved.status).toBe(200);
    expect(saved.body.title).toBe(validArticle.title);
  });

  test("should return 409 for a slug that already exists", async () => {
    const response = await create({ ...validArticle, slug: existingArticleSlug });

    showLog && console.log(response.body);
    expect(response.status).toBe(409);
    expect(response.body.message).toContain("already exists");
  });

  test("should return 400 for a content segment with empty content", async () => {
    const response = await create({
      ...validArticle,
      articleContent: [[{ contentType: ArticleContent.Link.type, content: "", href: "https://example.com" }]],
    });

    showLog && console.log(response.body);
    expect(response.status).toBe(400);
  });
});
