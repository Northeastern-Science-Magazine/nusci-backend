import request from "supertest";
import app from "../../../../app/app.js";
import { log } from "../../../testConfig.js";
import ArticlesAccessor from "../../../../app/databaseAccessors/articleAccessor.js";
import { executeReset, injectMockConnection, closeMockConnection } from "../../../util/util.js";

const showLog = __filename
  .replace(".js", "")
  .split(/[/\\]/)
  .splice(__filename.split(/[/\\]/).lastIndexOf("__tests__") + 1)
  .reduce((acc, key) => acc && acc[key], log);
beforeEach(injectMockConnection);
beforeEach(executeReset);
afterAll(closeMockConnection);

describe("Get published article count", () => {
  /* In-file testing data */
  const slugA = "exploring-the-future-ai-integration-in-everyday-life";
  const slugB = "world-death-rate-holding-steady-at-100-percent";
  const slugC = "discovery-of-ancient-flying-machine-leaves-scientists-baffled";

  test("Pending articles are not counted", async () => {
    const response = await request(app).get("/articles/count");
    showLog && console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual({ count: 0 });
  });

  test("Print and online articles are counted", async () => {
    await ArticlesAccessor.updateArticle(slugA, { articleStatus: "online" });
    await ArticlesAccessor.updateArticle(slugB, { articleStatus: "print" });

    const response = await request(app).get("/articles/count");
    showLog && console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual({ count: 2 });
  });

  test("Cancelled articles are not counted", async () => {
    await ArticlesAccessor.updateArticle(slugA, { articleStatus: "online" });
    await ArticlesAccessor.updateArticle(slugC, { articleStatus: "cancelled" });

    const response = await request(app).get("/articles/count");
    showLog && console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual({ count: 1 });
  });
});
