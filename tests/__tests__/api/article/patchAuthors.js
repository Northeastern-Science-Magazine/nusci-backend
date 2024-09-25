import { execSync } from "child_process";
import request from "supertest";
import app from "../../../../app/app.js";
import {
  validArticleSlug,
  validAuthorsUpdate,
  invalidAuthorsUpdate,
  emptyAuthorsUpdate,
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

describe("Update Article Authors", () => {
  test("should update article authors successfully", async () => {
    const response = await request(app)
      .patch(`/articles/authors/${validArticleSlug}`)
      .set("Cookie", [`token=${tokens.ethan}`])
      .send(validAuthorsUpdate);

    showLog && console.log(response.body);
    expect(response.status).toBe(200);
    console.log(response.body.authors);
    console.log(validAuthorsUpdate);
    expect({ authors: response.body.authors.map((author) => author.emails) }).toEqual(validAuthorsUpdate);
  });

  test("should update article authors to an empty list", async () => {
    const response = await request(app)
      .patch(`/articles/authors/${validArticleSlug}`)
      .set("Cookie", [`token=${tokens.ethan}`])
      .send(emptyAuthorsUpdate);

    showLog && console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body.authors).toEqual([]);
  });

  test("should fail to update article authors due to invalid author username", async () => {
    const response = await request(app)
      .patch(`/articles/authors/${validArticleSlug}`)
      .set("Cookie", [`token=${tokens.ethan}`])
      .send(invalidAuthorsUpdate);

    showLog && console.log(response.body);
    expect(response.status).toBe(404);
    expect(response.body.error).toBeDefined();
  });
});
