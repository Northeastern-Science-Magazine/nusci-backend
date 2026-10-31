import request from "supertest";
import { S3Client, HeadObjectCommand } from "@aws-sdk/client-s3";
import app from "../../../../app/app.js";
import ArchivedIssue from "../../../../app/models/dbModels/archivedIssue.js";
import PdfCoverService from "../../../../app/services/pdf/pdfCoverService.js";
import { ErrorValidation } from "../../../../app/error/errors.js";
import tokens from "../../../testData/tokenTestData.js";
import { log } from "../../../testConfig.js";
import { executeReset, injectMockConnection, closeMockConnection } from "../../../util/util.js";

const showLog = __filename
  .replace(".js", "")
  .split(/[/\\]/)
  .splice(__filename.split(/[/\\]/).lastIndexOf("__tests__") + 1)
  .reduce((acc, key) => acc && acc[key], log);

// presigning is done locally, so fake credentials are enough
process.env.AWS_ACCESS_KEY_ID = "test";
process.env.AWS_SECRET_ACCESS_KEY = "test";

// stands in for the bucket: key -> { ContentType, ContentLength }
let bucket;
const send = jest.spyOn(S3Client.prototype, "send").mockImplementation(async (command) => {
  const key = command.input.Key;
  if (command instanceof HeadObjectCommand) {
    if (!bucket[key]) {
      throw Object.assign(new Error("NotFound"), { name: "NotFound", $metadata: { httpStatusCode: 404 } });
    }
    return bucket[key];
  }
  throw new Error(`Unexpected S3 command ${command.constructor.name}`);
});

// rendering needs the real PDF (and pdftoppm), it has its own unit tests
const renderedCoverKey = `${process.env.S3_KEY_PREFIX}/archive/rendered-cover.jpg`;
const createCover = jest.spyOn(PdfCoverService, "createCover");

beforeEach(injectMockConnection);
beforeEach(executeReset);
beforeEach(() => {
  bucket = {};
  send.mockClear();
  createCover.mockReset().mockResolvedValue(renderedCoverKey);
});
afterAll(closeMockConnection);

const archiveKey = (name) => `${process.env.S3_KEY_PREFIX}/archive/${name}`;
const admin = [`token=${tokens["ethan@ethan.com"]}`];
const editor = [`token=${tokens["noah@noah.com"]}`];
const author = [`token=${tokens["jasmine@jasmine.com"]}`];

describe("Get archived issues", () => {
  test("lists archived issues newest first with presigned URLs", async () => {
    const response = await request(app).get("/archive");

    showLog && console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body.map((issue) => issue.issueNumber)).toStrictEqual([60, 59]);
    expect(response.body[0].pdfUrl).toContain("X-Amz-Signature=");
    expect(response.body[0].coverUrl).toContain("X-Amz-Signature=");
    expect(response.body[1].coverUrl).toContain("00000000-0000-0000-0000-000000000059.png");
    expect(response.body[0].pdfKey).toBeUndefined();
    expect(response.body[0].publicationDate).toBeUndefined();
  });

  test("gets an archived issue by number", async () => {
    const response = await request(app).get("/archive/60");

    showLog && console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body.title).toBe("Issue 60");
    expect(response.body.pdfUrl).toContain("00000000-0000-0000-0000-000000000060.pdf");
  });

  test("404 for an issue that isn't archived", async () => {
    const response = await request(app).get("/archive/1234");

    showLog && console.log(response.body);
    expect(response.status).toBe(404);
  });

  test("400 for an invalid issue number", async () => {
    const response = await request(app).get("/archive/abc");

    showLog && console.log(response.body);
    expect(response.status).toBe(400);
  });
});

describe("Create archived issue", () => {
  const newIssue = {
    issueNumber: 61,
    title: "Issue 61: Beyond",
    pdfKey: archiveKey("issue-61.pdf"),
  };

  beforeEach(() => {
    bucket[newIssue.pdfKey] = { ContentType: "application/pdf", ContentLength: 5_000_000 };
  });

  test("admin archives an uploaded issue, with its first page as the cover", async () => {
    const response = await request(app).post("/archive").set("Cookie", admin).send(newIssue);

    showLog && console.log(response.body);
    expect(response.status).toBe(201);
    expect(response.body.issueNumber).toBe(61);
    expect(response.body.title).toBe("Issue 61: Beyond");
    expect(response.body.pdfUrl).toContain("issue-61.pdf");
    expect(response.body.coverUrl).toContain("rendered-cover.jpg");
    expect(createCover).toHaveBeenCalledWith(newIssue.pdfKey);

    const record = await ArchivedIssue.findOne({ issueNumber: 61 });
    expect(record.coverKey).toBe(renderedCoverKey);

    const list = await request(app).get("/archive");
    expect(list.body.map((issue) => issue.issueNumber)).toStrictEqual([61, 60, 59]);
  });

  test("editor archives an issue, ignoring a cover and date sent by the client", async () => {
    const response = await request(app)
      .post("/archive")
      .set("Cookie", editor)
      .send({ ...newIssue, coverKey: archiveKey("client-cover.png"), publicationDate: "2025-12-01" });

    showLog && console.log(response.body);
    expect(response.status).toBe(201);
    expect(response.body.coverUrl).toContain("rendered-cover.jpg");
    expect(response.body.publicationDate).toBeUndefined();
  });

  test("reject a PDF whose first page can't be rendered", async () => {
    createCover.mockRejectedValue(new ErrorValidation("Couldn't read the first page of the PDF."));
    const response = await request(app).post("/archive").set("Cookie", admin).send(newIssue);

    showLog && console.log(response.body);
    expect(response.status).toBe(400);
    const get = await request(app).get("/archive/61");
    expect(get.status).toBe(404);
  });

  test("reject when not logged in", async () => {
    const response = await request(app).post("/archive").send(newIssue);
    expect(response.status).toBe(403);
  });

  test("reject roles other than admin and editor", async () => {
    const response = await request(app).post("/archive").set("Cookie", author).send(newIssue);
    expect(response.status).toBe(403);
  });

  test("reject duplicate issue number", async () => {
    const response = await request(app)
      .post("/archive")
      .set("Cookie", admin)
      .send({ ...newIssue, issueNumber: 60 });

    showLog && console.log(response.body);
    expect(response.status).toBe(409);
    expect(createCover).not.toHaveBeenCalled();
  });

  test("reject duplicate issue number archived concurrently", async () => {
    // another request saves issue 61 while this one is rendering its cover
    createCover.mockImplementation(async () => {
      const { _id, ...existing } = (await ArchivedIssue.findOne({ issueNumber: 60 })).toObject();
      await ArchivedIssue.create({ ...existing, issueNumber: 61 });
      return renderedCoverKey;
    });
    const response = await request(app).post("/archive").set("Cookie", admin).send(newIssue);

    showLog && console.log(response.body);
    expect(response.status).toBe(409);
  });

  test("reject a PDF that was never uploaded", async () => {
    const response = await request(app)
      .post("/archive")
      .set("Cookie", admin)
      .send({ ...newIssue, pdfKey: archiveKey("missing.pdf") });

    showLog && console.log(response.body);
    expect(response.status).toBe(400);
    expect(createCover).not.toHaveBeenCalled();
  });

  test("reject a key outside the archive folder", async () => {
    const outside = `${process.env.S3_KEY_PREFIX}/images/issue-61.pdf`;
    bucket[outside] = { ContentType: "application/pdf", ContentLength: 1000 };
    const response = await request(app)
      .post("/archive")
      .set("Cookie", admin)
      .send({ ...newIssue, pdfKey: outside });

    showLog && console.log(response.body);
    expect(response.status).toBe(400);
  });

  test("reject a PDF key that points at an image", async () => {
    const image = archiveKey("issue-61.png");
    bucket[image] = { ContentType: "image/png", ContentLength: 200_000 };
    const response = await request(app)
      .post("/archive")
      .set("Cookie", admin)
      .send({ ...newIssue, pdfKey: image });

    showLog && console.log(response.body);
    expect(response.status).toBe(400);
  });

  test("reject a file over the size limit", async () => {
    bucket[newIssue.pdfKey].ContentLength = 300 * 1024 * 1024;
    const response = await request(app).post("/archive").set("Cookie", admin).send(newIssue);

    showLog && console.log(response.body);
    expect(response.status).toBe(400);
  });

  test("reject missing fields", async () => {
    const response = await request(app).post("/archive").set("Cookie", admin).send({ issueNumber: 61 });

    showLog && console.log(response.body);
    expect(response.status).toBe(400);
  });
});

describe("Delete archived issue", () => {
  test("admin deletes an issue without touching its files", async () => {
    const response = await request(app).delete("/archive/60").set("Cookie", admin);

    showLog && console.log(response.body);
    expect(response.status).toBe(200);
    expect(send).not.toHaveBeenCalled();

    const get = await request(app).get("/archive/60");
    expect(get.status).toBe(404);
    const list = await request(app).get("/archive");
    expect(list.body.map((issue) => issue.issueNumber)).toStrictEqual([59]);
  });

  test("keeps the deleted issue's record so it can be restored", async () => {
    await request(app).delete("/archive/60").set("Cookie", editor);

    const record = await ArchivedIssue.findOne({ issueNumber: 60 });
    expect(record.deleted).toBe(true);
    expect(record.deletionTime).toBeInstanceOf(Date);
    expect(record.deletingUser).toBeDefined();
    expect(record.pdfKey).toBe("dev/archive/00000000-0000-0000-0000-000000000060.pdf");
    expect(record.coverKey).toBe("dev/archive/00000000-0000-0000-0000-000000000060.png");
  });

  test("a deleted issue number can be archived again", async () => {
    await request(app).delete("/archive/60").set("Cookie", admin);

    const reupload = { issueNumber: 60, title: "Issue 60", pdfKey: archiveKey("redo.pdf") };
    bucket[reupload.pdfKey] = { ContentType: "application/pdf", ContentLength: 5_000_000 };
    const response = await request(app).post("/archive").set("Cookie", admin).send(reupload);

    showLog && console.log(response.body);
    expect(response.status).toBe(201);
    const get = await request(app).get("/archive/60");
    expect(get.body.pdfUrl).toContain("redo.pdf");
  });

  test("404 when deleting an issue twice", async () => {
    await request(app).delete("/archive/60").set("Cookie", admin);
    const response = await request(app).delete("/archive/60").set("Cookie", admin);
    expect(response.status).toBe(404);
  });

  test("404 when deleting an issue that isn't archived", async () => {
    const response = await request(app).delete("/archive/1234").set("Cookie", admin);
    expect(response.status).toBe(404);
  });

  test("reject roles other than admin and editor", async () => {
    const response = await request(app).delete("/archive/60").set("Cookie", author);
    expect(response.status).toBe(403);

    const get = await request(app).get("/archive/60");
    expect(get.status).toBe(200);
  });
});
