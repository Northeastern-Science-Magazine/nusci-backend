import { execSync } from "child_process";
import request from "supertest";
import app from "../../../../app/app.js";
import Category from "../../../../app/models/enums/categories.js";
import {
    validArticleSlug,
    invalidArticleSlug,
    validSectionName,
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

describe("create and add article to issue map", () => {
  test("Invalid article creation due to invalid issue number", async () => {
    const requestBody = {
        articleSlug: validArticleSlug,
        issueNumber: -1,
        pageLength: 3,
        authors: ["existinguser@example.com"],
        editors: ["existinguser@example.com"],
        designers: ["existinguser@example.com"],
        photographers: ["existinguser@example.com"],
        section: validSectionName,
        categories: Category.Biology
    };
    const response = await request(app)
      .patch(`/issue-map/add-and-create-article`)
      .set("Cookie", [`token=${tokens.ethan}`])
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
        authors: -1,
        editors: ["existinguser@example.com"],
        designers: ["existinguser@example.com"],
        photographers: ["existinguser@example.com"],
        section: validSectionName,
        categories: Category.Biology
    };
    const response = await request(app)
      .patch(`/issue-map/add-and-create-article`)
      .set("Cookie", [`token=${tokens.ethan}`])
      .send(requestBody);
    showLog && console.log(response);
    expect(response.status).toBe(404);
    const errorMessage = JSON.parse(response.text).error;
    expect(errorMessage).toStrictEqual("Invalid Invalid request body.");
  });

  test("Invalid article creation due to invalid editors email", async () => {
    const requestBody = {
        articleSlug: validArticleSlug,
        issueNumber: 1,
        pageLength: 3,
        authors: ["existinguser@example.com"],
        editors: -1,
        designers: ["existinguser@example.com"],
        photographers: ["existinguser@example.com"],
        section: validSectionName,
        categories: Category.Biology
    };
    const response = await request(app)
      .patch(`/issue-map/add-and-create-article`)
      .set("Cookie", [`token=${tokens.ethan}`])
      .send(requestBody);
    showLog && console.log(response);
    expect(response.status).toBe(404);
    const errorMessage = JSON.parse(response.text).error;
    expect(errorMessage).toStrictEqual("Invalid Invalid request body.");
  });

  test("Invalid article creation due to invalid designers email", async () => {
    const requestBody = {
        articleSlug: validArticleSlug,
        issueNumber: 1,
        pageLength: 3,
        authors: ["existinguser@example.com"],
        editors: ["existinguser@example.com"],
        designers: -1,
        photographers: ["existinguser@example.com"],
        section: validSectionName,
        categories: Category.Biology
    };
    const response = await request(app)
      .patch(`/issue-map/add-and-create-article`)
      .set("Cookie", [`token=${tokens.ethan}`])
      .send(requestBody);
    showLog && console.log(response);
    expect(response.status).toBe(404);
    const errorMessage = JSON.parse(response.text).error;
    expect(errorMessage).toStrictEqual("Invalid Invalid request body.");
  });

  test("Invalid article removal due to invalid photographers email", async () => {
    const requestBody = {
        articleSlug: validArticleSlug,
        issueNumber: 1,
        pageLength: 3,
        authors: ["existinguser@example.com"],
        editors: ["existinguser@example.com"],
        designers: ["existinguser@example.com"],
        photographers: -1,
        section: validSectionName,
        categories: Category.Biology
    };
    const response = await request(app)
      .patch(`/issue-map/add-and-create-article`)
      .set("Cookie", [`token=${tokens.ethan}`])
      .send(requestBody);
    showLog && console.log(response);
    expect(response.status).toBe(404);
    const errorMessage = JSON.parse(response.text).error;
    expect(errorMessage).toStrictEqual("Invalid Invalid request body.");
  });

  test("Invalid article addition due to article slug already existed", async () => {
    const requestBody = {
        articleSlug: validArticleSlug,
        issueNumber: 1,
        pageLength: 3,
        authors: ["existinguser@example.com"],
        editors: ["existinguser@example.com"],
        designers: ["existinguser@example.com"],
        photographers: ["existinguser@example.com"],
        section: validSectionName,
        categories: Category.Biology
    };
    const response = await request(app)
      .patch(`/issue-map/add-and-create-article`)
      .set("Cookie", [`token=${tokens.ethan}`])
      .send(requestBody);
    showLog && console.log(response);
    expect(response.status).toBe(404);
    const errorMessage = JSON.parse(response.text).error;
    expect(errorMessage).toStrictEqual("Invalid Invalid request body.");
  });

  test("should create and add article to issue map successfully with missing authors/editors/designers/photographers", async () => {
    const requestBody = {
        articleSlug: validArticleSlug,
        issueNumber: 1,
        pageLength: 3,
        section: validSectionName,
        categories: Category.Biology
    };

    const response = await request(app)
      .patch(`/issue-map/add-and-create-article`)
      .set("Cookie", [`token=${tokens.ethan}`])
      .send(requestBody);

    showLog && console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body.articles).toContain(createdArticleID);
  });

  test("should create and add article to issue map successfully", async () => {

    const requestBody = {
        articleSlug: validArticleSlug,
        issueNumber: 1,
        pageLength: 3,
        authors: ["existinguser@example.com"],
        editors: ["existinguser@example.com"],
        designers: ["existinguser@example.com"],
        photographers: ["existinguser@example.com"],
        section: validSectionName,
        categories: Category.Biology
    };

    const response = await request(app)
      .patch(`/issue-map/add-and-create-article`)
      .set("Cookie", [`token=${tokens.ethan}`])
      .send(requestBody);

    showLog && console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body.articles).toContain(createdArticleID);
  });
});


