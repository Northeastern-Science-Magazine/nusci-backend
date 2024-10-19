import { execSync } from "child_process";
import fastify from "../../../../app/app.js";
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

// Open the database connection before all tests
beforeAll(async () => {
  await Connection.open(true);
  await fastify.ready(); // Ensure Fastify is fully ready
});

// Close the database connection after all tests
afterAll(async () => {
  await Connection.close(true);
  await fastify.close(); // Ensure Fastify instance is closed
});

// Reset the database state before each test
beforeEach(async () => {
  execSync("npm run reset-s", { stdio: "ignore" });
});

describe("Update Article Authors", () => {
  test("should update article authors successfully", async () => {
    const response = await fastify.inject({
      method: "PATCH",
      url: `/articles/authors/${validArticleSlug}`,
      headers: {
        Cookie: `token=${tokens.ethan}`,
      },
      payload: validAuthorsUpdate,
    });

    showLog && console.log(response.json());
    expect(response.statusCode).toBe(200);
    expect({
      authors: response.json().authors.map((author) => author.username),
    }).toEqual(validAuthorsUpdate);
  });

  test("should update article authors to an empty list", async () => {
    const response = await fastify.inject({
      method: "PATCH",
      url: `/articles/authors/${validArticleSlug}`,
      headers: {
        Cookie: `token=${tokens.ethan}`,
      },
      payload: emptyAuthorsUpdate,
    });

    showLog && console.log(response.json());
    expect(response.statusCode).toBe(200);
    expect(response.json().authors).toEqual([]);
  });

  test("should fail to update article authors due to invalid author username", async () => {
    const response = await fastify.inject({
      method: "PATCH",
      url: `/articles/authors/${validArticleSlug}`,
      headers: {
        Cookie: `token=${tokens.ethan}`,
      },
      payload: invalidAuthorsUpdate,
    });

    showLog && console.log(response.json());
    expect(response.statusCode).toBe(404);
    expect(response.json().error).toBeDefined();
  });
});
