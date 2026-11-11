import request from "supertest";
import app from "../../../../app/app.js";
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

describe("Search articles by issue number", () => {
  const search = (body) => request(app).post("/articles/search").send(body);

  test("Returns only articles in the given issue", async () => {
    const response = await search({ issueNumber: 3 });

    showLog && console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body.total).toBe(1);
    expect(response.body.results.map((article) => article.slug)).toStrictEqual([
      "world-death-rate-holding-steady-at-100-percent-2",
    ]);
  });

  test("Returns no articles for an issue with none", async () => {
    const response = await search({ issueNumber: 777 });

    showLog && console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body.total).toBe(0);
    expect(response.body.results).toStrictEqual([]);
  });

  test("Combines with the category filter", async () => {
    // Technology is also in issue 1, so only the issue 4 article should match
    const match = await search({ issueNumber: 4, categories: ["Technology"] });
    showLog && console.log(match.body);
    expect(match.status).toBe(200);
    expect(match.body.total).toBe(1);
    expect(match.body.results[0].issueNumber).toBe(4);
    expect(match.body.results[0].categories).toContain("Technology");

    // Health exists in other issues but not issue 4
    const noMatch = await search({ issueNumber: 4, categories: ["Health"] });
    showLog && console.log(noMatch.body);
    expect(noMatch.status).toBe(200);
    expect(noMatch.body.total).toBe(0);
  });

  test("Rejects a non-numeric issue number", async () => {
    const response = await search({ issueNumber: "3" });

    showLog && console.log(response.body);
    expect(response.status).toBe(400);
  });
});
