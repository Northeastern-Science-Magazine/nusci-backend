import Connection from "../db/connection.js";
import ArchivedIssue from "../models/dbModels/archivedIssue.js";

/**
 * ArchivedIssue Accessor Class
 *
 * Accesses the archived (print) issues.
 * Deleted issues are kept but flagged, and are left out of every lookup.
 */
export default class ArchivedIssueAccessor {
  /**
   * Creates a new archived issue
   *
   * @param {Object} issue - an instance of an ArchivedIssue model
   * @returns the new archived issue
   */
  static async createArchivedIssue(issue) {
    await Connection.open();
    const newIssue = await ArchivedIssue.create(issue);
    return newIssue;
  }

  /**
   * Gets all archived issues that haven't been deleted, newest issue first
   *
   * @returns archived issues
   */
  static async getAllArchivedIssues() {
    await Connection.open();
    const issues = await ArchivedIssue.find({ deleted: false }).sort({ issueNumber: -1 });
    return issues;
  }

  /**
   * Finds an archived issue that hasn't been deleted by its issue number
   *
   * @param {Number} issueNumber
   * @returns the archived issue, or null
   */
  static async getArchivedIssueByNumber(issueNumber) {
    await Connection.open();
    const issue = await ArchivedIssue.findOne({ issueNumber: issueNumber, deleted: false });
    return issue;
  }

  /**
   * Flags an archived issue as deleted. The record and its
   * S3 files are kept so the issue can be restored.
   *
   * @param {Number} issueNumber
   * @param {ObjectId} deletingUser
   * @returns the deleted archived issue, or null
   */
  static async deleteArchivedIssueByNumber(issueNumber, deletingUser) {
    await Connection.open();
    const issue = await ArchivedIssue.findOneAndUpdate(
      { issueNumber: issueNumber, deleted: false },
      { deleted: true, deletionTime: new Date(), deletingUser: deletingUser },
      { new: true }
    );
    return issue;
  }
}
