import request from "supertest";
import app from "../../../../app/app.js";
import tokens from "../../../testData/tokenTestData.js";
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

describe("Article Internal Comment Tests", () => {
  test("valid create comment (admin)", async () => {
    const response = await request(app)
      .post("/articles/add-internal-comment/world-death-rate-holding-steady-at-100-percent-2")
      .send({ comment: "second line should be clearer" })
      .set("Cookie", [`token=${tokens["ethan@ethan.com"]}`]);

    showLog && console.log(response.body);

    expect(response.status).toBe(201);
    expect(response.body.comments[0].comment).toBe("second line should be clearer");
  });

  test("valid create comment (editor)", async () => {
    const response = await request(app)
      .post("/articles/add-internal-comment/exploring-the-future-ai-integration-in-everyday-life")
      .send({ comment: "looks great, will publish soon" })
      .set("Cookie", [`token=${tokens["noah@noah.com"]}`]);

    showLog && console.log(response.body);
    expect(response.status).toBe(201);
    expect(response.body.comments[2].comment).toBe("looks great, will publish soon");
  });

  test("invalid create comment (malformed comment object)", async () => {
    const response = await request(app)
      .post("/articles/add-internal-comment/exploring-the-future-ai-integration-in-everyday-life")
      .send({ note: "this is a note" })
      .set("Cookie", [`token=${tokens["noah@noah.com"]}`]);

    showLog && console.log(response.body);
    expect(response.status).toBe(400);
    expect(response.body).toStrictEqual({
      error: "A validation error occurred.",
      message: "API Model Validation - Field 'comment' is required.",
    });
  });

  test("invalid create comment (invalid slug)", async () => {
    const response = await request(app)
      .post("/articles/add-internal-comment/this-is-a-fake-slug")
      .send({ comment: "this is a comment" })
      .set("Cookie", [`token=${tokens["noah@noah.com"]}`]);

    showLog && console.log(response.body);
    expect(response.status).toBe(404);
    expect(response.body).toStrictEqual({ error: "Article not found.", message: "" });
  });

  test("invalid create comment (invalid login)", async () => {
    const response = await request(app)
      .post("/articles/add-internal-comment/this-is-a-fake-slug")
      .send({ comment: "this is a comment" })
      .set("Cookie", [`token=${tokens["arushi@arushi.com"]}`]);

    showLog && console.log(response.body);
    expect(response.status).toBe(403);
    expect(response.body).toStrictEqual({ error: "Insufficient permissions to access this resource.", message: "" });
  });
});
