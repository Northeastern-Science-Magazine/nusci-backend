import { execSync } from "child_process";
import request from "supertest";
import app from "../../../../app/app.js";
import {
  validArticleSlug,
  validArticleStatusUpdate,
  invalidArticleStatusUpdate,
} from "../../../testData/articleTestData.js";
import Connection from "../../../../app/db/connection.js";
import tokens from "../../../testData/tokenTestData.js";
import { log } from "../../../testConfig.js";

const showLog = __filename
  .replace(".js", "")
  .split(/[/\\]/)
  .splice(__filename.split(/[/\\]/).lastIndexOf("__tests__") + 1)
  .reduce((acc, key) => acc && acc[key], log);

beforeAll(async () => {
  await Connection.open(true);
});

afterAll(async () => {
  await Connection.close(true);
});

beforeEach(async () => {
  execSync("npm run reset-s", { stdio: "ignore" });
});

describe("Update Article Status", () => {
  test("should update article status successfully", async () => {
    const response = await request(app)
      .patch(`/articles/article-status/${validArticleSlug}`)
      .set("Cookie", [`token=${tokens.ethan}`])
      .send(validArticleStatusUpdate);

    showLog && console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body.articleStatus).toBe(validArticleStatusUpdate.articleStatus);
  });

  test("should fail to update article status due to invalid status type", async () => {
    const response = await request(app)
      .patch(`/articles/article-status/${validArticleSlug}`)
      .set("Cookie", [`token=${tokens.ethan}`])
      .send(invalidArticleStatusUpdate);

    showLog && console.log(response.body);
    expect(response.status).toBe(400);
    expect(response.body.error).toBeDefined();
  });

  test("should fail to update article status due to invalid permissions", async () => {
    const response = await request(app)
      .patch(`/articles/article-status/${validArticleSlug}`)
      .set("Cookie", [`token=${tokens.jasmine}`])
      .send(validArticleStatusUpdate);

    showLog && console.log(response.body);
    expect(response.status).toBe(403);
    expect(response.body.error).toBeDefined();
  });
});
