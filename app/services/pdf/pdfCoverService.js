import { execFile } from "child_process";
import { promisify } from "util";
import fs from "fs/promises";
import os from "os";
import path from "path";
import S3Service from "../s3/s3Service.js";
import MediaFolder from "../../models/enums/mediaFolder.js";
import { ErrorUnexpected, ErrorValidation } from "../../error/errors.js";

const run = promisify(execFile);

// rendered cover size: sharp on retina screens, ~150-300KB as a JPEG
const COVER_WIDTH_PX = 1000;
const COVER_JPEG_QUALITY = 85;
// a normal magazine cover renders in a second or two
const RENDER_TIMEOUT_MS = 60 * 1000;

/**
 * PdfCoverService Class
 *
 * Makes an archived issue's cover by rendering the first page of its PDF.
 *
 * Rendering is done by `pdftoppm` from poppler-utils, which the Dockerfile installs.
 * The PDF is streamed to a temp file first, so even a 250MB issue never sits in memory.
 */
export default class PdfCoverService {
  /**
   * Renders the first page of an uploaded PDF and saves it as a cover in S3.
   *
   * @param {String} pdfKey S3 key of the uploaded PDF
   * @returns {Promise<String>} S3 key of the new cover image
   */
  static async createCover(pdfKey) {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), "nusci-cover-"));
    try {
      const pdfPath = path.join(dir, "issue.pdf");
      await S3Service.downloadToFile(pdfKey, pdfPath);
      const cover = await PdfCoverService.renderFirstPage(pdfPath);
      return await S3Service.putObject(MediaFolder.Archive, "image/jpeg", cover);
    } finally {
      await fs.rm(dir, { recursive: true, force: true });
    }
  }

  /**
   * Renders the first page of a PDF on disk to a JPEG.
   *
   * @param {String} pdfPath
   * @returns {Promise<Buffer>} the JPEG
   */
  static async renderFirstPage(pdfPath) {
    const outputBase = path.join(path.dirname(pdfPath), "cover");
    try {
      // -singlefile writes <outputBase>.jpg, scale-to-y -1 keeps the page's aspect ratio
      await run(
        "pdftoppm",
        [
          "-f",
          "1",
          "-l",
          "1",
          "-singlefile",
          "-jpeg",
          "-jpegopt",
          `quality=${COVER_JPEG_QUALITY}`,
          "-scale-to-x",
          String(COVER_WIDTH_PX),
          "-scale-to-y",
          "-1",
          pdfPath,
          outputBase,
        ],
        { timeout: RENDER_TIMEOUT_MS }
      );
    } catch (e) {
      if (e.code === "ENOENT") {
        throw new ErrorUnexpected("pdftoppm is not installed, so covers can't be rendered (needs poppler-utils).");
      }
      if (e.killed) {
        throw new ErrorValidation("The PDF's first page took too long to render.");
      }
      throw new ErrorValidation("Couldn't read the first page of the PDF. Check that it's a valid PDF.");
    }
    return fs.readFile(`${outputBase}.jpg`);
  }
}
