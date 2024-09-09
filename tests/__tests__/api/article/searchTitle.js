// searchArticles.test.js
import request from "supertest";
import app from "../../../../app/app.js";
import { validArticleSearchQuery, noResultSearchQuery } from "../../../testData/articleTestData.js";
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

describe("Search Articles", () => {
  test("should return relevant articles for a valid fuzzy search query", async () => {
    const response = await request(app).get(`/articles/search/title`).query({ search: validArticleSearchQuery });

    showLog && console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(2); // Adjust based on expected results
    expect(
      response.body.every(
        (article) => article.title.includes(validArticleSearchQuery) || article.content.includes(validArticleSearchQuery)
      )
    ).toBe(true);
  });

  test("should return no results for an invalid search query", async () => {
    const response = await request(app).get(`/articles/search/title`).query({ search: noResultSearchQuery });

    showLog && console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(0);
  });
});
