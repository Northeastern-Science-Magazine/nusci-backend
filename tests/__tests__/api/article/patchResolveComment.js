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

describe("Article Resolve Internal Comment Tests", () => {
  test("valid comment resolve (admin)", async () => {
    const response = await request(app)
      .patch("/articles/resolve-internal-comment")
      .send({ commentId: "c00000000000000000000001" })
      .set("Cookie", [`token=${tokens["ethan@ethan.com"]}`]);

    showLog && console.log(response.body);
    expect(response.status).toBe(201);
  });

  test("invalid resolve comment (invalid login)", async () => {
    const response = await request(app)
      .patch("/articles/resolve-internal-comment")
      .send({ commentId: "c00000000000000000000001" })
      .set("Cookie", [`token=${tokens["arushi@arushi.com"]}`]);

    showLog && console.log(response.body);
    expect(response.status).toBe(403);
    expect(response.body).toStrictEqual({ error: "Insufficient permissions to access this resource.", message: "" });
  });

  test("invalid resolve comment (invalid id)", async () => {
    const response = await request(app)
      .patch("/articles/resolve-internal-comment")
      .send({ commentId: "66ba07fc440f0ccec39b317e" })
      .set("Cookie", [`token=${tokens["ethan@ethan.com"]}`]);

    showLog && console.log(response.body);
    expect(response.status).toBe(201);
  });

  test("invalid resolve comment (already resolved)", async () => {
    const response = await request(app)
      .patch("/articles/resolve-internal-comment")
      .send({ commentId: "c00000000000000000000002" })
      .set("Cookie", [`token=${tokens["ethan@ethan.com"]}`]);

    showLog && console.log(response.body);
    expect(response.status).toBe(201);
  });
});
