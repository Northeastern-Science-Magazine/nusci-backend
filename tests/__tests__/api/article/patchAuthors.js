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

describe("Update Article Authors", () => {
  /* In-file test data */
  const validArticleSlug = "exploring-the-future-ai-integration-in-everyday-life";
  const validAuthorsUpdate = { authors: ["anika@anika.com", "jasmine@jasmine.com"] };
  const emptyAuthorsUpdate = { authors: [] };
  const invalidAuthorsUpdate = { authors: ["invalidUsername"] };

  test("should update article authors successfully", async () => {
    const response = await request(app)
      .patch(`/articles/authors/${validArticleSlug}`)
      .set("Cookie", [`token=${tokens["ethan@ethan.com"]}`])
      .send(validAuthorsUpdate);

    showLog && console.log(response.body);
    expect(response.status).toBe(200);
    expect({ authors: response.body.authors.map((author) => author.email) }).toEqual(validAuthorsUpdate);
  });

  test("should update article authors to an empty list", async () => {
    const response = await request(app)
      .patch(`/articles/authors/${validArticleSlug}`)
      .set("Cookie", [`token=${tokens["ethan@ethan.com"]}`])
      .send(emptyAuthorsUpdate);

    showLog && console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body.authors).toEqual([]);
  });

  test("should fail to update article authors due to invalid author username", async () => {
    const response = await request(app)
      .patch(`/articles/authors/${validArticleSlug}`)
      .set("Cookie", [`token=${tokens["ethan@ethan.com"]}`])
      .send(invalidAuthorsUpdate);

    showLog && console.log(response.body);
    expect(response.status).toBe(404);
    expect(response.body.error).toBeDefined();
  });
});
