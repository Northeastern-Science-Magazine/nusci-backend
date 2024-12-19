import { execSync } from "child_process";
import request from "supertest";
import app from "../../../../app/app.js";
import {
  validArticleSlugFromIssue1,
  validArticleSlugFromIssue2,
  invalidArticleSlug,
  articleObjectIdAfterIssue1Removal,
  articleObjectIdAfterIssue2Removal,
} from "../../../testData/issueMapTestData.js";
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

describe("Remove article from issue map", () => {
  test("Invalid article removal due to invalid issue number", async () => {
    const requestBody = {
      issueNumber: -1,
      articleSlug: validArticleSlugFromIssue2,
    };

    const response = await request(app)
      .patch(`/issue-map/remove-article`)
      .set("Cookie", [`token=${tokens["ethan@ethan.com"]}`])
      .send(requestBody);

    showLog && console.log(response);
    expect(response.status).toBe(404);
    const errorMessage = JSON.parse(response.text).error;
    expect(errorMessage).toStrictEqual("Invalid combination of article slug and issue number.");
  });

  test("Invalid article removal due to invalid slug (article is in a different issue)", async () => {
    const requestBody = {
      issueNumber: 1,
      articleSlug: validArticleSlugFromIssue2,
    };

    const response = await request(app)
      .patch(`/issue-map/remove-article`)
      .set("Cookie", [`token=${tokens["ethan@ethan.com"]}`])
      .send(requestBody);

    showLog && console.log(response);
    expect(response.status).toBe(404);
    const errorMessage = JSON.parse(response.text).error;
    expect(errorMessage).toStrictEqual("Invalid combination of article slug and issue number.");
  });

  test("Invalid article removal due to invalid slug (does not exist in any issues)", async () => {
    const requestBody = {
      issueNumber: 1,
      articleSlug: invalidArticleSlug,
    };

    const response = await request(app)
      .patch(`/issue-map/remove-article`)
      .set("Cookie", [`token=${tokens["ethan@ethan.com"]}`])
      .send(requestBody);

    showLog && console.log(response);
    expect(response.status).toBe(404);
    const errorMessage = JSON.parse(response.text).error;
    expect(errorMessage).toStrictEqual("Article not found.");
  });

  test("should successfully remove article from the issue map", async () => {
    const requestBody = {
      issueNumber: 1,
      articleSlug: validArticleSlugFromIssue1,
    };

    const response = await request(app)
      .patch(`/issue-map/remove-article`)
      .set("Cookie", [`token=${tokens["ethan@ethan.com"]}`])
      .send(requestBody);

    showLog && console.log(response);
    expect(response.status).toBe(200);
    expect(response.body.articles).toStrictEqual(articleObjectIdAfterIssue1Removal);
  });

  test("should successfully remove article from the issue map", async () => {
    const requestBody = {
      issueNumber: 2,
      articleSlug: validArticleSlugFromIssue2,
    };

    const response = await request(app)
      .patch(`/issue-map/remove-article`)
      .set("Cookie", [`token=${tokens["ethan@ethan.com"]}`])
      .send(requestBody);

    showLog && console.log(response);
    expect(response.status).toBe(200);
    expect(response.body.articles).toStrictEqual(articleObjectIdAfterIssue2Removal);
  });

  test("Invalid removal of article due to empty request body", async () => {
    const requestBody = {};

    const response = await request(app)
      .patch(`/issue-map/remove-article`)
      .set("Cookie", [`token=${tokens["ethan@ethan.com"]}`])
      .send(requestBody);

    showLog && console.log(response);
    expect(response.status).toBe(404);
    const errorMessage = JSON.parse(response.text).error;
    expect(errorMessage).toStrictEqual("Invalid request body.");
  });

  test("Invalid removal of article due to empty request body", async () => {
    const requestBody = {
      issueNumber: 1,
    };

    const response = await request(app)
      .patch(`/issue-map/remove-article`)
      .set("Cookie", [`token=${tokens["ethan@ethan.com"]}`])
      .send(requestBody);

    showLog && console.log(response);
    expect(response.status).toBe(404);
    const errorMessage = JSON.parse(response.text).error;
    expect(errorMessage).toStrictEqual("Invalid request body.");
  });

  test("Invalid removal of article due to empty request body", async () => {
    const requestBody = {
      articleSlug: validArticleSlugFromIssue1,
    };

    const response = await request(app)
      .patch(`/issue-map/remove-article`)
      .set("Cookie", [`token=${tokens["ethan@ethan.com"]}`])
      .send(requestBody);

    showLog && console.log(response);
    expect(response.status).toBe(404);
    const errorMessage = JSON.parse(response.text).error;
    expect(errorMessage).toStrictEqual("Invalid request body.");
  });
});
