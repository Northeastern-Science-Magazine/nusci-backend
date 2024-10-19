import { execSync } from "child_process";
import fastify from "../../../../app/app.js";
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
  await fastify.ready(); // Ensure Fastify is fully ready
});

afterAll(async () => {
  await Connection.close(true);
  await fastify.close(); // Ensure Fastify instance is closed
});

beforeEach(async () => {
  execSync("npm run reset-s", { stdio: "ignore" });
});

describe("Update Article Status", () => {
  test("should update article status successfully", async () => {
    const response = await fastify.inject({
      method: "PATCH",
      url: `/articles/article-status/${validArticleSlug}`,
      headers: {
        Cookie: `token=${tokens.ethan}`
      },
      payload: validArticleStatusUpdate
    })

    showLog && console.log(response.body);
    expect(response.statusCode).toBe(200);
    expect(response.json().articleStatus).toBe(validArticleStatusUpdate.articleStatus);
  });

  test("should fail to update article status due to invalid status type", async () => {
    const response = await fastify.inject({
      method: "PATCH",
      url: `/articles/article-status/${validArticleSlug}`,
      headers: {
        Cookie: `token=${tokens.ethan}`
      },
      payload: invalidArticleStatusUpdate
    })

    showLog && console.log(response.body);
    expect(response.statusCode).toBe(400);
    expect(response.json().error).toBeDefined();
  });

  test("should fail to update article status due to invalid permissions", async () => {
    const response = await fastify.inject({
      method: "PATCH",
      url: `/articles/article-status/${validArticleSlug}`,
      headers: {
        Cookie: `token=${tokens.jasmine}`
      },
      payload: validArticleStatusUpdate
    })

    showLog && console.log(response.body);
    expect(response.statusCode).toBe(403);
    expect(response.json().error).toBeDefined();
  });
});
