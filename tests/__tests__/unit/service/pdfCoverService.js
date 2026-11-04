import { spawnSync } from "child_process";
import fs from "fs/promises";
import { existsSync } from "fs";
import os from "os";
import path from "path";
import PdfCoverService from "../../../../app/services/pdf/pdfCoverService.js";
import S3Service from "../../../../app/services/s3/s3Service.js";
import MediaFolder from "../../../../app/models/enums/mediaFolder.js";
import { ErrorValidation } from "../../../../app/error/errors.js";

// CI and the Docker image have pdftoppm, skip the rendering tests on machines without poppler
const hasPdftoppm = !spawnSync("pdftoppm", ["-v"]).error;
const describeRender = hasPdftoppm ? describe : describe.skip;

/**
 * Builds a valid one page PDF, filled with a single color.
 *
 * @param {Number} width in points
 * @param {Number} height in points
 * @returns {Buffer}
 */
function onePagePdf(width, height) {
  const content = `0.2 0.4 0.3 rg 0 0 ${width} ${height} re f`;
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${width} ${height}] /Contents 4 0 R >>`,
    `<< /Length ${content.length} >>\nstream\n${content}\nendstream`,
  ];
  let pdf = "%PDF-1.4\n";
  const offsets = objects.map((object, i) => {
    const offset = pdf.length;
    pdf += `${i + 1} 0 obj\n${object}\nendobj\n`;
    return offset;
  });
  const xref = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  pdf += offsets.map((offset) => `${String(offset).padStart(10, "0")} 00000 n \n`).join("");
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
  return Buffer.from(pdf);
}

/**
 * Reads a JPEG's dimensions from its start of frame marker.
 *
 * @param {Buffer} jpeg
 * @returns {{ width: Number, height: Number }}
 */
function jpegSize(jpeg) {
  let i = 2;
  while (i < jpeg.length) {
    const marker = jpeg[i + 1];
    if (marker >= 0xc0 && marker <= 0xc2) {
      return { height: jpeg.readUInt16BE(i + 5), width: jpeg.readUInt16BE(i + 7) };
    }
    i += 2 + jpeg.readUInt16BE(i + 2);
  }
  throw new Error("No start of frame marker");
}

let dir;
beforeEach(async () => {
  dir = await fs.mkdtemp(path.join(os.tmpdir(), "cover-test-"));
});
afterEach(async () => {
  jest.restoreAllMocks();
  await fs.rm(dir, { recursive: true, force: true });
});

describeRender("PdfCoverService rendering tests", () => {
  test("renders the first page as a 1000px wide JPEG, keeping its aspect ratio", async () => {
    const pdfPath = path.join(dir, "issue.pdf");
    await fs.writeFile(pdfPath, onePagePdf(300, 400));

    const cover = await PdfCoverService.renderFirstPage(pdfPath);

    expect(cover.subarray(0, 3)).toStrictEqual(Buffer.from([0xff, 0xd8, 0xff]));
    const { width, height } = jpegSize(cover);
    expect(width).toBe(1000);
    // 400 * 1000 / 300, poppler may round either way
    expect(Math.abs(height - 1333)).toBeLessThanOrEqual(1);
  });

  test("rejects a file that isn't a PDF", async () => {
    const pdfPath = path.join(dir, "issue.pdf");
    await fs.writeFile(pdfPath, "<html>not a pdf</html>");

    await expect(PdfCoverService.renderFirstPage(pdfPath)).rejects.toThrow(ErrorValidation);
  });

  test("createCover renders the uploaded PDF, saves the cover and cleans up", async () => {
    let downloadedTo;
    jest.spyOn(S3Service, "downloadToFile").mockImplementation(async (key, filePath) => {
      downloadedTo = filePath;
      await fs.writeFile(filePath, onePagePdf(300, 400));
    });
    const putObject = jest.spyOn(S3Service, "putObject").mockResolvedValue("dev/archive/cover.jpg");

    const key = await PdfCoverService.createCover("dev/archive/issue.pdf");

    expect(key).toBe("dev/archive/cover.jpg");
    expect(S3Service.downloadToFile).toHaveBeenCalledWith("dev/archive/issue.pdf", expect.any(String));
    const [folder, contentType, body] = putObject.mock.calls[0];
    expect(folder).toBe(MediaFolder.Archive);
    expect(contentType).toBe("image/jpeg");
    expect(jpegSize(body).width).toBe(1000);
    expect(existsSync(path.dirname(downloadedTo))).toBe(false);
  });
});

describe("PdfCoverService failure tests", () => {
  test("cleans up the temp files when the download fails", async () => {
    let downloadedTo;
    jest.spyOn(S3Service, "downloadToFile").mockImplementation(async (key, filePath) => {
      downloadedTo = filePath;
      throw new Error("S3 is down");
    });

    await expect(PdfCoverService.createCover("dev/archive/issue.pdf")).rejects.toThrow("S3 is down");
    expect(existsSync(path.dirname(downloadedTo))).toBe(false);
  });
});
