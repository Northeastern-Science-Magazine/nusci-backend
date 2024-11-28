import { ErrorValidation } from "../../error/errors.js";

/**
 * Enumerated Class for Writing Statuses
 */
export default class WritingStatus {
  static Needs_Editor = new WritingStatus("needs_editor");
  static Has_Editor = new WritingStatus("has_editor");
  static Rough_Draft_Complete = new WritingStatus("rough_draft_complete");
  static Edits_Complete = new WritingStatus("edits_complete");
  static Copy_Edits_Complete = new WritingStatus("copy_edits_complete");
  static EIC_Approved = new WritingStatus("eic_approved");
  static Dropped = new WritingStatus("dropped");

  /**
   * INTERNAL USE ONLY
   * Construct a WritingStatus enum
   *
   * @param {String} status
   */
  constructor(status) {
    this.status = status;
  }

  /**
   * WritingStatus to its associated string
   *
   * @returns {String}
   */
  toString() {
    return this.status;
  }

  /**
   * String to its associated WritingStatus object
   *
   * @param {String} str
   * @returns {WritingStatus}
   */
  static toWritingStatus(str) {
    const writingStatus = this.list().find(obj => obj.toString() === str.toLowerCase());
    if (!writingStatus) {
      throw new ErrorValidation("Invalid Writing Status enum given.");
    }
    return writingStatus;
  }

  /**
   * Returns all WritingStatus objects as a list.
   *
   * @returns {List[WritingStatus]}
   */
  static list() {
    return Object.values(this);
  }

  /**
   * Returns all WritingStatus as a list of strings
   */
  static listr() {
    return Object.values(this).map((val) => val.toString());
  }
}
