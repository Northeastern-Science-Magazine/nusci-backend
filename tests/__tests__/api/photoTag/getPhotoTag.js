import request from "supertest";
import app from "../../../../app/app.js";
import { log } from "../../../testConfig.js";
import { executeReset, injectMockConnection, closeMockConnection } from "../../../util/util.js";
import { photoTagResponseNature, photoTagResponseTravel } from "../../../testData/photoTagTestData.js";

const showLog = __filename
  .replace(".js", "")
  .split(/[/\\]/)
  .splice(__filename.split(/[/\\]/).lastIndexOf("__tests__") + 1)
  .reduce((acc, key) => acc && acc[key], log);

beforeEach(injectMockConnection);
beforeEach(executeReset);
afterAll(closeMockConnection);

describe("Get PhotoTag By TagName Tests", () => {
  test("get a photo tag by a valid/existing tagName (Nature)", async () => {
    const response = await request(app).get("/phototag/name/Nature");

    showLog && console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual(photoTagResponseNature);
  });

  test("get a photo tag by a valid/existing tagName (Travel)", async () => {
    const response = await request(app).get("/phototag/name/Travel");

    showLog && console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual(photoTagResponseTravel);
  });

  test("attempt to get a photo tag with an invalid/non-existent tagName", async () => {
    const response = await request(app).get("/phototag/name/nonexistentTag");

    showLog && console.log(response.body);
    expect(response.body).toStrictEqual({ error: "Photo tag not found.", message: "" });
    expect(response.status).toBe(404);
  });
});
