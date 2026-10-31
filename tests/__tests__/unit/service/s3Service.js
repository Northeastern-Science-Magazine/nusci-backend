import fs from "fs/promises";
import os from "os";
import path from "path";
import { Readable } from "stream";
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import S3Service from "../../../../app/services/s3/s3Service.js";
import MediaFolder from "../../../../app/models/enums/mediaFolder.js";
import { ErrorValidation } from "../../../../app/error/errors.js";

describe("S3Service key tests", () => {
  const env = { ...process.env };

  beforeEach(() => {
    process.env.S3_KEY_PREFIX = "dev";
    process.env.S3_BUCKET_NAME = "nusci-media";
  });
  afterAll(() => {
    process.env = env;
  });

  test("builds keys under the environment and folder prefix", () => {
    expect(S3Service.buildKey(MediaFolder.Archive, "application/pdf")).toMatch(/^dev\/archive\/[0-9a-f-]{36}\.pdf$/);
    expect(S3Service.buildKey(MediaFolder.Images, "image/jpeg")).toMatch(/^dev\/images\/[0-9a-f-]{36}\.jpg$/);
  });

  test("uses the prod prefix in prod", () => {
    process.env.S3_KEY_PREFIX = "prod";
    expect(S3Service.buildKey(MediaFolder.Archive, "application/pdf")).toMatch(/^prod\/archive\//);
  });

  test("rejects content types the folder doesn't allow", () => {
    expect(() => S3Service.buildKey(MediaFolder.Images, "application/pdf")).toThrow(ErrorValidation);
    expect(() => S3Service.buildKey(MediaFolder.Archive, "text/html")).toThrow(ErrorValidation);
    // archive covers are rendered by the server, not uploaded
    expect(() => S3Service.buildKey(MediaFolder.Archive, "image/png")).toThrow(ErrorValidation);
  });

  test("builds keys for server-made files regardless of the folder's upload types", () => {
    expect(S3Service.newKey(MediaFolder.Archive, "image/jpeg")).toMatch(/^dev\/archive\/[0-9a-f-]{36}\.jpg$/);
    expect(() => S3Service.newKey(MediaFolder.Archive, "text/html")).toThrow();
  });

  test("checks keys belong to a folder", () => {
    expect(S3Service.isKeyInFolder("dev/archive/a.pdf", MediaFolder.Archive)).toBe(true);
    expect(S3Service.isKeyInFolder("dev/images/a.pdf", MediaFolder.Archive)).toBe(false);
    expect(S3Service.isKeyInFolder("prod/archive/a.pdf", MediaFolder.Archive)).toBe(false);
    expect(S3Service.isKeyInFolder("dev/archive/../images/a.pdf", MediaFolder.Archive)).toBe(false);
    expect(S3Service.isKeyInFolder(undefined, MediaFolder.Archive)).toBe(false);
  });

  test("throws when the bucket isn't configured", () => {
    delete process.env.S3_BUCKET_NAME;
    expect(() => S3Service.bucket()).toThrow();
  });

  test("throws when the key prefix isn't configured", () => {
    delete process.env.S3_KEY_PREFIX;
    expect(() => S3Service.buildKey(MediaFolder.Archive, "application/pdf")).toThrow();
  });
});

describe("S3Service endpoint tests", () => {
  const env = { ...process.env };

  beforeEach(() => {
    jest.resetModules();
    process.env.AWS_REGION = "us-east-1";
    process.env.S3_BUCKET_NAME = "nusci-media";
    process.env.S3_KEY_PREFIX = "dev";
    process.env.AWS_ACCESS_KEY_ID = "test";
    process.env.AWS_SECRET_ACCESS_KEY = "test";
    delete process.env.S3_ENDPOINT;
    delete process.env.S3_PUBLIC_ENDPOINT;
  });
  afterAll(() => {
    process.env = env;
  });

  // fresh module per test, since the clients are cached
  const loadService = async () => (await import("../../../../app/services/s3/s3Service.js")).default;

  test("signs URLs for AWS when no endpoint is set", async () => {
    const S3 = await loadService();
    const url = await S3.createDownloadUrl("dev/archive/a.pdf");
    expect(url).toMatch(/^https:\/\/nusci-media\.s3\.us-east-1\.amazonaws\.com\/dev\/archive\/a\.pdf\?/);
  });

  test("signs URLs for the public endpoint when one is set", async () => {
    process.env.S3_ENDPOINT = "http://minio:9000";
    process.env.S3_PUBLIC_ENDPOINT = "http://localhost:9000";
    const S3 = await loadService();
    const { uploadUrl } = await S3.createUploadUrl(MediaFolder.Archive, "application/pdf", 1024);
    expect(uploadUrl).toMatch(/^http:\/\/localhost:9000\/nusci-media\/dev\/archive\//);
  });

  test("falls back to S3_ENDPOINT when there's no public endpoint", async () => {
    process.env.S3_ENDPOINT = "http://localhost:9000";
    const S3 = await loadService();
    const url = await S3.createDownloadUrl("dev/archive/a.pdf");
    expect(url).toMatch(/^http:\/\/localhost:9000\/nusci-media\/dev\/archive\/a\.pdf\?/);
  });

  test("upload URLs sign the content type and length", async () => {
    const S3 = await loadService();
    const { uploadUrl } = await S3.createUploadUrl(MediaFolder.Images, "image/png", 1024);
    const signed = new URL(uploadUrl).searchParams.get("X-Amz-SignedHeaders").split(";");
    expect(signed).toEqual(expect.arrayContaining(["content-length", "content-type"]));
  });
});

describe("S3Service server-side file tests", () => {
  const env = { ...process.env };
  let send;

  beforeEach(() => {
    process.env.AWS_REGION = "us-east-1";
    process.env.S3_BUCKET_NAME = "nusci-media";
    process.env.S3_KEY_PREFIX = "dev";
    process.env.AWS_ACCESS_KEY_ID = "test";
    process.env.AWS_SECRET_ACCESS_KEY = "test";
    send = jest.spyOn(S3Client.prototype, "send");
  });
  afterEach(() => {
    send.mockRestore();
  });
  afterAll(() => {
    process.env = env;
  });

  test("putObject uploads to a new key and returns it", async () => {
    send.mockResolvedValue({});
    const body = Buffer.from("cover");
    const key = await S3Service.putObject(MediaFolder.Archive, "image/jpeg", body);

    expect(key).toMatch(/^dev\/archive\/[0-9a-f-]{36}\.jpg$/);
    const command = send.mock.calls[0][0];
    expect(command).toBeInstanceOf(PutObjectCommand);
    expect(command.input).toStrictEqual({ Bucket: "nusci-media", Key: key, Body: body, ContentType: "image/jpeg" });
  });

  test("getObjectInfo treats a 403 as missing", async () => {
    send.mockRejectedValue(Object.assign(new Error("Forbidden"), { $metadata: { httpStatusCode: 403 } }));
    expect(await S3Service.getObjectInfo("dev/archive/missing.pdf")).toBeNull();
  });

  test("downloadToFile streams the object to disk", async () => {
    send.mockResolvedValue({ Body: Readable.from([Buffer.from("%PDF-"), Buffer.from("1.4")]) });
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), "s3-test-"));
    try {
      const file = path.join(dir, "issue.pdf");
      await S3Service.downloadToFile("dev/archive/a.pdf", file);

      expect(send.mock.calls[0][0]).toBeInstanceOf(GetObjectCommand);
      expect(send.mock.calls[0][0].input).toStrictEqual({ Bucket: "nusci-media", Key: "dev/archive/a.pdf" });
      expect(await fs.readFile(file, "utf8")).toBe("%PDF-1.4");
    } finally {
      await fs.rm(dir, { recursive: true, force: true });
    }
  });
});

describe("MediaFolder enum tests", () => {
  test("toMediaFolder", () => {
    expect(MediaFolder.toMediaFolder("archive")).toBe(MediaFolder.Archive);
    expect(MediaFolder.toMediaFolder("Images")).toBe(MediaFolder.Images);
    expect(() => MediaFolder.toMediaFolder("secrets")).toThrow(ErrorValidation);
  });

  test("listr", () => {
    expect(MediaFolder.listr()).toStrictEqual(["archive", "images"]);
  });

  test("canUpload", () => {
    expect(MediaFolder.Archive.canUpload(["admin"])).toBe(true);
    expect(MediaFolder.Archive.canUpload(["editor"])).toBe(false);
    expect(MediaFolder.Archive.canUpload(["author", "photographer"])).toBe(false);
    expect(MediaFolder.Images.canUpload(["author"])).toBe(true);
    expect(MediaFolder.Images.canUpload(["none"])).toBe(false);
    expect(MediaFolder.Images.canUpload([])).toBe(false);
  });
});
