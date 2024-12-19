import { execSync } from "child_process";
import request from "supertest";
import app from "../../../../app/app.js";
import { validArticleSlug, validSectionName } from "../../../testData/issueMapTestData.js";
import Connection from "../../../../app/db/connection.js";
import tokens from "../../../testData/tokenTestData.js";
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

describe("create and add article to issue map", () => {
  test("Invalid article creation due to invalid issue number", async () => {
    const requestBody = {
      articleSlug: "Article 1",
      issueNumber: -1,
      pageLength: 3,
      authors: ["ethan@ethan.com"],
      editors: ["ethan@ethan.com"],
      designers: ["ethan@ethan.com"],
      photographers: ["ethan@ethan.com"],
      section: validSectionName,
      categories: "biology",
    };
    const response = await request(app)
      .patch(`/issue-map/add-and-create-article`)
      .set("Cookie", [`token=${tokens["ethan@ethan.com"]}`])
      .send(requestBody);
    showLog && console.log(response);
    expect(response.status).toBe(404);
    const errorMessage = JSON.parse(response.text).error;
    expect(errorMessage).toStrictEqual("Invalid request body.");
  });

  test("Invalid article creation due to invalid authors email", async () => {
    const requestBody = {
      articleSlug: validArticleSlug,
      issueNumber: 1,
      pageLength: 3,
      authors: ["invalid@email.com"],
      editors: ["ethan@ethan.com"],
      designers: ["ethan@ethan.com"],
      photographers: ["ethan@ethan.com"],
      section: validSectionName,
      categories: "biology",
    };
    const response = await request(app)
      .patch(`/issue-map/add-and-create-article`)
      .set("Cookie", [`token=${tokens["ethan@ethan.com"]}`])
      .send(requestBody);
    showLog && console.log(response);
    expect(response.status).toBe(404);
    const errorMessage = JSON.parse(response.text).error;
    expect(errorMessage).toStrictEqual("Invalid request body.");
  });

  test("Invalid article creation due to invalid editors email", async () => {
    const requestBody = {
      articleSlug: validArticleSlug,
      issueNumber: 1,
      pageLength: 3,
      authors: ["ethan@ethan.com"],
      editors: ["ethan@ethan.com", "invalid@email.com"],
      designers: ["ethan@ethan.com"],
      photographers: ["ethan@ethan.com"],
      section: validSectionName,
      categories: "biology",
    };
    const response = await request(app)
      .patch(`/issue-map/add-and-create-article`)
      .set("Cookie", [`token=${tokens["ethan@ethan.com"]}`])
      .send(requestBody);
    showLog && console.log(response);
    expect(response.status).toBe(404);
    const errorMessage = JSON.parse(response.text).error;
    expect(errorMessage).toStrictEqual("Invalid request body.");
  });

  test("Invalid article creation due to invalid designers email", async () => {
    const requestBody = {
      articleSlug: validArticleSlug,
      issueNumber: 1,
      pageLength: 3,
      authors: ["ethan@ethan.com"],
      editors: ["ethan@ethan.com"],
      designers: ["invalid@email.com"],
      photographers: ["ethan@ethan.com"],
      section: validSectionName,
      categories: "biology",
    };
    const response = await request(app)
      .patch(`/issue-map/add-and-create-article`)
      .set("Cookie", [`token=${tokens["ethan@ethan.com"]}`])
      .send(requestBody);
    showLog && console.log(response);
    expect(response.status).toBe(404);
    const errorMessage = JSON.parse(response.text).error;
    expect(errorMessage).toStrictEqual("Invalid request body.");
  });

  test("Invalid article addition due to invalid photographers email", async () => {
    const requestBody = {
      articleSlug: validArticleSlug,
      issueNumber: 1,
      pageLength: 3,
      authors: ["ethan@ethan.com"],
      editors: ["ethan@ethan.com"],
      designers: ["ethan@ethan.com"],
      photographers: ["invalid@email.com"],
      section: validSectionName,
      categories: "biology",
    };
    const response = await request(app)
      .patch(`/issue-map/add-and-create-article`)
      .set("Cookie", [`token=${tokens["ethan@ethan.com"]}`])
      .send(requestBody);
    showLog && console.log(response);
    expect(response.status).toBe(404);
    const errorMessage = JSON.parse(response.text).error;
    expect(errorMessage).toStrictEqual("Invalid request body.");
  });

  test("Invalid article addition due to article slug already existed", async () => {
    const requestBody = {
      articleSlug: validArticleSlug,
      issueNumber: 1,
      pageLength: 3,
      authors: ["ethan@ethan.com"],
      editors: ["ethan@ethan.com"],
      designers: ["ethan@ethan.com"],
      photographers: ["ethan@ethan.com"],
      section: validSectionName,
      categories: "biology",
    };
    const response = await request(app)
      .patch(`/issue-map/add-and-create-article`)
      .set("Cookie", [`token=${tokens["ethan@ethan.com"]}`])
      .send(requestBody);
    showLog && console.log(response);
    expect(response.status).toBe(404);
    const errorMessage = JSON.parse(response.text).error;
    expect(errorMessage).toStrictEqual("Invalid request body.");
  });

  test("should create and add article to issue map successfully with missing authors/editors/designers/photographers", async () => {
    const requestBody = {
      articleSlug: "New article",
      issueNumber: 2,
      pageLength: 5,
    };

    const response = await request(app)
      .patch(`/issue-map/add-and-create-article`)
      .set("Cookie", [`token=${tokens["ethan@ethan.com"]}`])
      .send(requestBody);

    showLog && console.log(response);
    expect(response.status).toBe(200);

    const createdArticleID = response.body.articles.at(-1);
    const article = await ArticlesAccessor.getArticle(createdArticleID);

    expect(article.issueNumber).toStrictEqual(requestBody.issueNumber);
    expect(article.slug).toStrictEqual(requestBody.articleSlug);
    expect(article.articleStatus).toStrictEqual("print");
    expect(article.designStatus).toStrictEqual("needs_designer");
    expect(article.photographyStatus).toStrictEqual("needs_photographer");
    expect(article.writingStatus).toStrictEqual("needs_editor");
  });

  test("should create and add article to issue map successfully with authos/editors/designers/photographers given", async () => {
    const requestBody = {
      articleSlug: "Another new article",
      issueNumber: 2,
      pageLength: 3,
      authors: ["ethan@ethan.com"],
      editors: ["ethan@ethan.com"],
      designers: ["ethan@ethan.com"],
      photographers: ["ethan@ethan.com"],
      section: validSectionName,
      categories: "biology",
    };

    const response = await request(app)
      .patch(`/issue-map/add-and-create-article`)
      .set("Cookie", [`token=${tokens["ethan@ethan.com"]}`])
      .send(requestBody);

    showLog && console.log(response);
    expect(response.status).toBe(200);

    const sectionIndex = response.body.sections.findIndex((sec) => sec.sectionName === validSectionName);
    const createdArticleID = response.body.sections[sectionIndex].articles.at(-1);
    const article = await ArticlesAccessor.getArticle(createdArticleID);

    expect(article.issueNumber).toStrictEqual(requestBody.issueNumber);
    expect(article.slug).toStrictEqual(requestBody.articleSlug);
    expect(article.designStatus).toStrictEqual("has_designer");
    expect(article.photographyStatus).toStrictEqual("photographer_assigned");
    expect(article.writingStatus).toStrictEqual("has_editor");
  });
});
