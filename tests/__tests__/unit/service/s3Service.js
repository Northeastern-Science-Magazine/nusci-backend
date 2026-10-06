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
    const { uploadUrl } = await S3.createUploadUrl(MediaFolder.Archive, "application/pdf");
    expect(uploadUrl).toMatch(/^http:\/\/localhost:9000\/nusci-media\/dev\/archive\//);
  });

  test("falls back to S3_ENDPOINT when there's no public endpoint", async () => {
    process.env.S3_ENDPOINT = "http://localhost:9000";
    const S3 = await loadService();
    const url = await S3.createDownloadUrl("dev/archive/a.pdf");
    expect(url).toMatch(/^http:\/\/localhost:9000\/nusci-media\/dev\/archive\/a\.pdf\?/);
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
});
