import { ErrorValidation } from "../../error/errors.js";

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

/**
 * Enumerated Class for S3 media folders
 *
 * Each folder is a key prefix in the media bucket
 * (under the environment prefix, i.e. prod/archive/)
 * along with the content types and max size it accepts.
 */
export default class MediaFolder {
  static Archive = new MediaFolder("archive", ["application/pdf", ...IMAGE_TYPES], 250 * 1024 * 1024);
  static Images = new MediaFolder("images", IMAGE_TYPES, 25 * 1024 * 1024);

  /**
   * INTERNAL USE ONLY
   * Construct a MediaFolder enum
   *
   * @param {String} folder
   * @param {List[String]} contentTypes allowed content types
   * @param {Number} maxBytes max allowed file size
   */
  constructor(folder, contentTypes, maxBytes) {
    this.folder = folder;
    this.contentTypes = contentTypes;
    this.maxBytes = maxBytes;
  }

  /**
   * MediaFolder to its associated string
   *
   * @returns {String}
   */
  toString() {
    return this.folder;
  }

  /**
   * Lists media folders.
   *
   * @returns {List[MediaFolder]}
   */
  static list() {
    return Object.values(this);
  }

  /**
   * Lists media folders in string value.
   *
   * @returns {List[String]}
   */
  static listr() {
    return Object.values(this).map((folder) => folder.toString());
  }

  /**
   * String into its associated MediaFolder object
   *
   * @param {String} str
   * @returns {MediaFolder}
   */
  static toMediaFolder(str) {
    const folder = Object.values(this).find((folder) => folder.toString() === str?.toLowerCase());
    if (!folder) {
      throw new ErrorValidation(`Folder ${str} not found in media folder enum.`);
    }
    return folder;
  }
}
