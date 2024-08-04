import { execSync } from "child_process";
import request from "supertest";
import app from "../../../../app/app.js";
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

describe("Article Internal Comment Tests", () => {
  test("valid create comment (admin)", async () => {
    const response = await request(app)
      .post("/articles/add-internal-comment/world-death-rate-holding-steady-at-100-percent-2")
      .send({ comment: "second line should be clearer" })
      .set("Cookie", [`token=${tokens.ethan}`]);

    showLog && console.log(response.body);
    expect(response.status).toBe(201);
    expect(response.body.comments[0].comment).toBe("second line should be clearer");
  });

  test("valid create comment (editor)", async () => {
    const response = await request(app)
      .post("/articles/add-internal-comment/exploring-the-future-ai-integration-in-everyday-life")
      .send({ comment: "looks great, will publish soon" })
      .set("Cookie", [`token=${tokens.noah}`]);

    showLog && console.log(response.body);
    expect(response.status).toBe(201);
    expect(response.body.comments[2].comment).toBe("looks great, will publish soon");
  });

  test("invalid create comment (malformed comment object)", async () => {
    const response = await request(app)
      .post("/articles/add-internal-comment/exploring-the-future-ai-integration-in-everyday-life")
      .send({ note: "this is a note" })
      .set("Cookie", [`token=${tokens.noah}`]);

    showLog && console.log(response.body);
    expect(response.status).toBe(400);
    expect(response.body).toStrictEqual({ error: "Malformed API Model." });
  });

  test("invalid create comment (invalid slug)", async () => {
    const response = await request(app)
      .post("/articles/add-internal-comment/this-is-a-fake-slug")
      .send({ comment: "this is a comment" })
      .set("Cookie", [`token=${tokens.noah}`]);

    showLog && console.log(response.body);
    expect(response.status).toBe(404);
    expect(response.body).toStrictEqual({ error: "Article not found." });
  });

  test("invalid create comment (invalid login)", async () => {
    const response = await request(app)
      .post("/articles/add-internal-comment/this-is-a-fake-slug")
      .send({ comment: "this is a comment" })
      .set("Cookie", [`token=${tokens.arushi}`]);

    showLog && console.log(response.body);
    expect(response.status).toBe(403);
    expect(response.body).toStrictEqual({ error: "User is incorrect." });
  });
});
