import request from "supertest";
import app from "../../../../app/app.js";
import { log } from "../../../testConfig.js";
import Article from "../../../../app/models/dbModels/article.js";
import ArticlesAccessor from "../../../../app/databaseAccessors/articleAccessor.js";
import articles from "../../../../setup/seed/articles_seed.js";
import { executeReset, injectMockConnection, closeMockConnection } from "../../../util/util.js";

const showLog = __filename
  .replace(".js", "")
  .split(/[/\\]/)
  .splice(__filename.split(/[/\\]/).lastIndexOf("__tests__") + 1)
  .reduce((acc, key) => acc && acc[key], log);
beforeEach(injectMockConnection);
beforeEach(executeReset);
afterEach(() => jest.restoreAllMocks());
afterAll(closeMockConnection);

const search = (body) => request(app).post("/articles/search").send(body);
const slugs = (response) => response.body.results.map((article) => article.slug);

describe("Search articles (regular)", () => {
  test("asc sort flips the default desc sort", async () => {
    const desc = await search({});
    const asc = await search({ sortBy: "asc" });

    showLog && console.log(desc.body, asc.body);
    expect(desc.status).toBe(200);
    expect(asc.status).toBe(200);
    expect(desc.body.total).toBeGreaterThan(1);
    // Some seeded articles share timestamps, so check ordering rather than an exact sequence.
    const approvalTime = (slug) => articles.find((article) => article.slug === slug).approvalTime.getTime();
    const ascTimes = slugs(asc).map(approvalTime);
    const descTimes = slugs(desc).map(approvalTime);
    expect(ascTimes).toStrictEqual([...ascTimes].sort((a, b) => a - b));
    expect(descTimes).toStrictEqual([...descTimes].sort((a, b) => b - a));
    expect(ascTimes[0]).toBeLessThan(descTimes[0]);
  });

  test("skip and limit paginate results, total ignores pagination", async () => {
    const all = await search({});
    const page = await search({ skip: 1, limit: 2 });

    expect(page.status).toBe(200);
    expect(page.body.total).toBe(all.body.total);
    expect(slugs(page)).toStrictEqual(slugs(all).slice(1, 3));
  });

  test("whitespace-only textQuery falls back to regular search", async () => {
    const aggregate = jest.spyOn(Article, "aggregate");
    const response = await search({ textQuery: "   " });

    expect(response.status).toBe(200);
    expect(aggregate).not.toHaveBeenCalled();
  });

  test("invalid request body is rejected", async () => {
    const response = await search({ limit: -1 });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Search request validation failed");
  });

  test("unexpected errors return 500", async () => {
    jest.spyOn(ArticlesAccessor, "searchArticles").mockRejectedValue(new Error("db down"));
    const response = await search({});

    expect(response.status).toBe(500);
  });
});

// Atlas $search isn't available locally, so Article.aggregate is mocked and we check the pipeline it's given.
describe("Search articles (text query)", () => {
  const mockAggregate = (total) =>
    jest
      .spyOn(Article, "aggregate")
      .mockImplementation(async (pipeline) =>
        pipeline.some((stage) => stage.$count) ? (total === undefined ? [] : [{ total }]) : []
      );

  test("builds a $search pipeline with filters and pagination", async () => {
    const aggregate = mockAggregate(7);
    const response = await search({ textQuery: " tardigrades ", categories: ["Technology"], skip: 2, limit: 3 });

    showLog && console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual({ results: [], total: 7 });

    const [results, count] = aggregate.mock.calls.map(([pipeline]) => pipeline);
    expect(results[0].$search.text.query).toBe("tardigrades");
    expect(results).toContainEqual({ $match: { categories: { $in: ["Technology"] } } });
    expect(results).toContainEqual({ $skip: 2 });
    expect(results).toContainEqual({ $limit: 3 });
    expect(count).toContainEqual({ $count: "total" });
    expect(count).not.toContainEqual({ $skip: 2 });
  });

  test("no filters or pagination, and no matches gives total 0", async () => {
    const aggregate = mockAggregate();
    const response = await search({ textQuery: "nothing", issueNumber: 1 });

    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual({ results: [], total: 0 });

    const [results] = aggregate.mock.calls[0];
    expect(results).toContainEqual({ $match: { issueNumber: 1 } });
    expect(results.some((stage) => stage.$skip || stage.$limit)).toBe(false);
  });
});
