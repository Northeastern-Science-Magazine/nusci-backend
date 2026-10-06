import request from "supertest";
import app from "../../../../app/app.js";
import tokens from "../../../testData/tokenTestData.js";
import { log } from "../../../testConfig.js";

const showLog = __filename
  .replace(".js", "")
  .split(/[/\\]/)
  .splice(__filename.split(/[/\\]/).lastIndexOf("__tests__") + 1)
  .reduce((acc, key) => acc && acc[key], log);

// presigning is done locally, so fake credentials are enough (nothing is sent to AWS)
process.env.AWS_ACCESS_KEY_ID = "test";
process.env.AWS_SECRET_ACCESS_KEY = "test";

describe("Presigned upload URL tests", () => {
  const pdfRequest = { folder: "archive", contentType: "application/pdf", size: 10 * 1024 * 1024 };

  test("admin gets a presigned upload URL for a PDF", async () => {
    const response = await request(app)
      .post("/media/upload-url")
      .set("Cookie", [`token=${tokens["ethan@ethan.com"]}`])
      .send(pdfRequest);

    showLog && console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body.key).toMatch(new RegExp(`^${process.env.S3_KEY_PREFIX}/archive/[0-9a-f-]{36}\\.pdf$`));
    expect(response.body.uploadUrl).toContain(`${process.env.S3_BUCKET_NAME}`);
    expect(response.body.uploadUrl).toContain(encodeURIComponent(response.body.key).replace(/%2F/g, "/"));
    expect(response.body.uploadUrl).toContain("X-Amz-Signature=");
    expect(response.body.contentType).toBe("application/pdf");
    expect(response.body.expiresIn).toBe(300);
  });

  test("editor gets a presigned upload URL for an image", async () => {
    const response = await request(app)
      .post("/media/upload-url")
      .set("Cookie", [`token=${tokens["noah@noah.com"]}`])
      .send({ folder: "images", contentType: "image/png", size: 1024 });

    showLog && console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body.key).toMatch(new RegExp(`^${process.env.S3_KEY_PREFIX}/images/.+\\.png$`));
  });

  test("every request gets a unique key", async () => {
    const [first, second] = await Promise.all(
      [1, 2].map(() =>
        request(app)
          .post("/media/upload-url")
          .set("Cookie", [`token=${tokens["ethan@ethan.com"]}`])
          .send(pdfRequest)
      )
    );

    expect(first.body.key).not.toBe(second.body.key);
  });

  test("reject when not logged in", async () => {
    const response = await request(app).post("/media/upload-url").send(pdfRequest);

    showLog && console.log(response.body);
    expect(response.status).toBe(403);
  });

  test("reject roles other than admin and editor", async () => {
    const response = await request(app)
      .post("/media/upload-url")
      .set("Cookie", [`token=${tokens["jasmine@jasmine.com"]}`])
      .send(pdfRequest);

    showLog && console.log(response.body);
    expect(response.status).toBe(403);
  });

  test("reject unknown folder", async () => {
    const response = await request(app)
      .post("/media/upload-url")
      .set("Cookie", [`token=${tokens["ethan@ethan.com"]}`])
      .send({ ...pdfRequest, folder: "../secrets" });

    showLog && console.log(response.body);
    expect(response.status).toBe(400);
  });

  test("reject content type not allowed in folder", async () => {
    const response = await request(app)
      .post("/media/upload-url")
      .set("Cookie", [`token=${tokens["ethan@ethan.com"]}`])
      .send({ folder: "images", contentType: "application/pdf", size: 1024 });

    showLog && console.log(response.body);
    expect(response.status).toBe(400);
  });

  test("reject file over the folder's size limit", async () => {
    const response = await request(app)
      .post("/media/upload-url")
      .set("Cookie", [`token=${tokens["ethan@ethan.com"]}`])
      .send({ folder: "images", contentType: "image/png", size: 26 * 1024 * 1024 });

    showLog && console.log(response.body);
    expect(response.status).toBe(400);
  });

  test("reject missing size", async () => {
    const response = await request(app)
      .post("/media/upload-url")
      .set("Cookie", [`token=${tokens["ethan@ethan.com"]}`])
      .send({ folder: "archive", contentType: "application/pdf" });

    showLog && console.log(response.body);
    expect(response.status).toBe(400);
  });
});
