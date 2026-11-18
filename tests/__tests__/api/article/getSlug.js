import request from "supertest";
import app from "../../../../app/app.js";
import articles from "../../../../setup/seed/articles_seed.js";
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

const PRIVATE_USER_FIELDS = ["password", "phone", "status"];
const USER_FIELDS = ["authors", "editors", "designers", "photographers"];

/** Every populated user in an article response: contributors, the approver and commenters */
const usersIn = (article) =>
  [
    ...USER_FIELDS.flatMap((field) => article[field] ?? []),
    article.approvingUser,
    ...(article.comments ?? []).map((comment) => comment.user),
  ].filter((user) => user && typeof user === "object");

const expectNoPrivateFields = (article) => {
  const users = usersIn(article);
  expect(users.length).toBeGreaterThan(0);
  for (const user of users) {
    expect(user.email).toBeDefined();
    for (const field of PRIVATE_USER_FIELDS) {
      expect(user).not.toHaveProperty(field);
    }
  }
  expect(JSON.stringify(article)).not.toMatch(/"password"/);
};

describe("Get Article By Slug", () => {
  test.each(articles.map((article) => article.slug))("should not leak private user fields for %s", async (slug) => {
    const response = await request(app).get(`/articles/slug/${slug}`);

    showLog && console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body.slug).toBe(slug);
    expectNoPrivateFields(response.body);
  });

  test("should still populate contributors with their public fields", async () => {
    const slug = "exploring-the-future-ai-integration-in-everyday-life";
    const response = await request(app).get(`/articles/slug/${slug}`);

    showLog && console.log(response.body);
    for (const author of response.body.authors) {
      expect(author).toEqual(
        expect.objectContaining({ firstName: expect.any(String), lastName: expect.any(String), email: expect.any(String) })
      );
    }
  });

  test("should return 404 for an unknown slug", async () => {
    const response = await request(app).get("/articles/slug/not-a-real-article");

    showLog && console.log(response.body);
    expect(response.status).toBe(404);
  });
});

describe("Article Search", () => {
  test("should not leak private user fields on search results", async () => {
    const response = await request(app).post("/articles/search").send({});

    showLog && console.log(response.body);
    expect(response.status).toBe(200);
    expect(JSON.stringify(response.body)).not.toMatch(/"(password|phone)"/);
  });
});
