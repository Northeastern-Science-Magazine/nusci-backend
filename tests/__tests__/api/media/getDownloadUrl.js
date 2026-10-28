import request from "supertest";
import app from "../../../../app/app.js";
import { log } from "../../../testConfig.js";

const showLog = __filename
  .replace(".js", "")
  .split(/[/\\]/)
  .splice(__filename.split(/[/\\]/).lastIndexOf("__tests__") + 1)
  .reduce((acc, key) => acc && acc[key], log);

// presigning is done locally, so fake credentials are enough (nothing is sent to AWS)
process.env.AWS_ACCESS_KEY_ID = "test";
process.env.AWS_SECRET_ACCESS_KEY = "test";

describe("Presigned download URL tests", () => {
  const imageKey = `${process.env.S3_KEY_PREFIX}/images/0b5c3d1e-0000-4000-8000-000000000001.jpg`;

  test("anyone gets a download URL for an image, without logging in", async () => {
    const response = await request(app).get("/media/download-url").query({ key: imageKey });

    showLog && console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body.url).toContain(imageKey);
    expect(response.body.url).toContain("X-Amz-Signature=");
    expect(response.body.expiresIn).toBe(3600);
  });

  test("reject keys outside the images folder", async () => {
    for (const key of [
      `${process.env.S3_KEY_PREFIX}/archive/issue.pdf`,
      `${process.env.S3_KEY_PREFIX}/images/../archive/issue.pdf`,
      "prod-but-not-really/images/a.jpg",
    ]) {
      const response = await request(app).get("/media/download-url").query({ key });

      showLog && console.log(response.body);
      expect(response.status).toBe(400);
    }
  });

  test("reject a missing key", async () => {
    const response = await request(app).get("/media/download-url");

    showLog && console.log(response.body);
    expect(response.status).toBe(400);
  });
});
