import { ErrorInternalEnumValidation } from "../../error/internalErrors.js";

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
    switch (str.toLowerCase()) {
      case this.Needs_Editor.status:
        return this.Needs_Editor;
      case this.Has_Editor.status:
        return this.Has_Editor;
      case this.Rough_Draft_Complete.status:
        return this.Rough_Draft_Complete;
      case this.Edits_Complete.status:
        return this.Edits_Complete;
      case this.Copy_Edits_Complete.status:
        return this.Copy_Edits_Complete;
      case this.EIC_Approved.status:
        return this.EIC_Approved;
      case this.Dropped.status:
        return this.Dropped;
      default:
        throw new ErrorInternalEnumValidation("Invalid WritingStatus given.");
    }
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
