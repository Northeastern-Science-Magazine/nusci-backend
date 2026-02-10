import request from "supertest";
import app from "../../../../app/app.js";
import ArticleStatus from "../../../../app/models/enums/articleStatus.js";
import tokens from "../../../testData/tokenTestData.js";
import { log } from "../../../testConfig.js";
import { executeReset, injectMockConnection, closeMockConnection } from "../../../util/util.js";
import * as z from "zod";

const showLog = __filename
  .replace(".js", "")
  .split(/[/\\]/)
  .splice(__filename.split(/[/\\]/).lastIndexOf("__tests__") + 1)
  .reduce((acc, key) => acc && acc[key], log);
beforeEach(injectMockConnection);
beforeEach(executeReset);
afterAll(closeMockConnection);

describe("Update Article Status", () => {
  /* In-file testing data */
  const validArticleSlug = "exploring-the-future-ai-integration-in-everyday-life";
  const articleStatusPrint = ArticleStatus.Print.toString();

  test("should update article status successfully", async () => {
    const response = await request(app)
      .patch(`/articles/article-status/${validArticleSlug}`)
      .set("Cookie", [`token=${tokens["ethan@ethan.com"]}`])
      .send({
        articleStatus: articleStatusPrint,
      });

    showLog && console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body.articleStatus).toBe(articleStatusPrint);
  });

  test("should fail to update article status due to invalid status type", async () => {
    const response = await request(app)
      .patch(`/articles/article-status/${validArticleSlug}`)
      .set("Cookie", [`token=${tokens["ethan@ethan.com"]}`])
      .send({
        articleStatus: "unknown_status",
      });

    showLog && console.log(response.body);
    expect(response.status).toBe(400);
    expect(response.body.error).toBeDefined();
  });

  test("should fail to update article status due to invalid permissions", async () => {
    const response = await request(app)
      .patch(`/articles/article-status/${validArticleSlug}`)
      .set("Cookie", [`token=${tokens["jasmine@jasmine.com"]}`])
      .send({
        articleStatus: articleStatusPrint,
      });

    showLog && console.log(response.body);
    expect(response.status).toBe(403);
    expect(response.body.error).toBeDefined();
  });
});
