import request from "supertest";
import app from "../../../app/app.js";
import Connection from "../../../app/db/connection.js";
import logTestSuite from "../../util.js";
import tokens from "../../testData/tokenTestData.js";
import {
  validArticleStatusUpdate,
  invalidArticleStatusUpdate,
  validAuthorsUpdate,
  emptyAuthorsUpdate,
  invalidAuthorsUpdate,
  validArticleSlug,
  invalidArticleSlug,
} from "../../testData/articleTestData.js";

afterAll(async () => {
  await Connection.close();
});

describe("Article Controller Tests", () => {
  describe("Update Article Status", () => {
    test("should update article status successfully", async () => {
      const response = await request(app)
        .patch(`/articles/article-status/${validArticleSlug}`)
        .set("Cookie", [`token=${tokens.ethan}`])
        .send(validArticleStatusUpdate);

      logTestSuite.article && console.log(response.body);
      expect(response.status).toBe(200);
      expect(response.body.articleStatus).toBe(validArticleStatusUpdate.articleStatus);
    });

    test("should fail to update article status due to invalid status type", async () => {
      const response = await request(app)
        .patch(`/articles/article-status/${validArticleSlug}`)
        .set("Cookie", [`token=${tokens.ethan}`])
        .send(invalidArticleStatusUpdate);

      logTestSuite.article && console.log(response.body);
      expect(response.status).toBe(400);
      expect(response.body.error).toBeDefined();
    });

    test("should fail to update article status due to invalid permissions", async () => {
      const response = await request(app)
        .patch(`/articles/article-status/${validArticleSlug}`)
        .set("Cookie", [`token=${tokens.jasmine}`]) // assuming jasmine does not have admin privileges
        .send(validArticleStatusUpdate);

      logTestSuite.article && console.log(response.body);
      expect(response.status).toBe(403);
      expect(response.body.error).toBeDefined();
    });
  });

  describe("Update Article Authors", () => {
    test("should update article authors successfully", async () => {
      const response = await request(app)
        .patch(`/articles/authors/${validArticleSlug}`)
        .set("Cookie", [`token=${tokens.ethan}`])
        .send(validAuthorsUpdate);

      logTestSuite.article && console.log(response.body);
      expect(response.status).toBe(200);
      expect(response.body.authors).toEqual(expect.arrayContaining(validAuthorsUpdate.authorsIDs));
    });

    test("should update article authors to an empty list", async () => {
      const response = await request(app)
        .patch(`/articles/authors/${validArticleSlug}`)
        .set("Cookie", [`token=${tokens.ethan}`])
        .send(emptyAuthorsUpdate);

      logTestSuite.article && console.log(response.body);
      expect(response.status).toBe(200);
      expect(response.body.authors).toEqual([]);
    });

    test("should fail to update article authors due to invalid author username", async () => {
      const response = await request(app)
        .patch(`/articles/authors/${validArticleSlug}`)
        .set("Cookie", [`token=${tokens.ethan}`])
        .send(invalidAuthorsUpdate);

      logTestSuite.article && console.log(response.body);
      expect(response.status).toBe(500);
      expect(response.body.error).toBeDefined();
    });
  });
});
