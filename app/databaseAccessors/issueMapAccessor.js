import IssueMap from "../models/dbModels/issueMap.js";
import Article from "../models/dbModels/article.js";
import Connection from "../db/connection.js";
import mongoose from "mongoose";
import { ErrorArticleNotFound, ErrorInvalidArticleAndIssueCombination } from "../error/errors.js";

/**
 * IssueMap Accessor Class
 *
 * Accesses the issue maps
 */
export default class IssueMapAccessor {
  /**
   * Get all issues
   *
   * @returns all issues
   */
  static async getAllIssues() {
    await Connection.open();
    const issues = await IssueMap.find({});
    return issues;
  }

  /**
   * Create an issue
   *
   * @param {Object} issue - The issue to create
   * @returns the created issue
   */
  static async createIssue(issue) {
    await Connection.open();
    const newIssue = await IssueMap.create(issue);
    return newIssue;
  }

  /**
   * Update an issue's fields. If the issue number changes, articles
   * pointing at the old number are moved to the new one.
   *
   * @param {Number} issueNumber - The issue number to update
   * @param {Object} updates - The fields to update
   * @returns the updated issue
   */
  static async updateIssue(issueNumber, updates) {
    await Connection.open();
    const updatedIssue = await IssueMap.findOneAndUpdate(
      { issueNumber },
      { ...updates, modificationTime: new Date() },
      { new: true, runValidators: true }
    );

    if (updatedIssue && updates.issueNumber !== undefined && updates.issueNumber !== issueNumber) {
      await Article.updateMany({ issueNumber }, { issueNumber: updates.issueNumber });
    }

    return updatedIssue;
  }

  /**
   * Delete an issue
   *
   * @param {Number} issueNumber - The issue number to delete
   * @returns the deleted issue
   */
  static async deleteIssue(issueNumber) {
    await Connection.open();
    const deletedIssue = await IssueMap.findOneAndDelete({ issueNumber });
    return deletedIssue;
  }

  /**
   * Find issue by its ID
   *
   * @param {ObjectID} issueID - The ID of the issue
   * @returns Issue
   */
  static async getIssueByID(issueID) {
    await Connection.open();
    const issue = await IssueMap.findById(new mongoose.Types.ObjectId(issueID));
    return issue;
  }

  /**
   * Find issues by issue number
   *
   * @param {Number} issueNumber - The issue number
   * @returns issues
   */
  static async getIssuesByNumber(issueNumber) {
    await Connection.open();
    const issue = await IssueMap.find({ issueNumber: issueNumber });
    return issue;
  }

  /**
   * Find issue by its name
   *
   * @param {String} issueName - The name of the issue
   * @returns Issue
   */
  static async getIssueByName(issueName) {
    await Connection.open();
    const issue = await IssueMap.findOne({ issueName: issueName });
    return issue;
  }

  /**
   * Find issues by article
   *
   * @param {ObjectID} articleID - The ID of the article
   * @returns issues
   */
  static async getIssuesByArticle(articleID) {
    await Connection.open();
    const issues = await IssueMap.find({ articles: { $in: [new mongoose.Types.ObjectId(articleID)] } });
    return issues;
  }

  /**
   * Find issues by pages range
   *
   * @param {Number} min - Minimum number of pages
   * @param {Number} max - Maximum number of pages
   * @returns issues
   */
  static async getIssuesByPagesRange(min, max) {
    await Connection.open();
    const issues = await IssueMap.find({ pages: { $gte: min, $lte: max } });
    return issues;
  }

  static async getIssueMapByIssueNumber(issueNumber) {
    await Connection.open();
    const issueMap = await IssueMap.findOne({ issueNumber });
    return issueMap;
  }

  /**
   * Find issues by user
   *
   * @param {String} userID - The ID of the user
   * @returns issues
   */
  static async getIssuesByUser(userID) {
    await Connection.open();
    const issues = await IssueMap.find({ creatingUser: new mongoose.Types.ObjectId(userID) });
    return issues;
  }

  /**
   * Find issues by creation time range
   *
   * @param {Date} start - Start of creation time range
   * @param {Date} end - End of creation time range
   * @returns issues
   */
  static async getIssuesByCreationTimeRange(start, end) {
    await Connection.open();
    const issues = await IssueMap.find({ creationTime: { $gte: start, $lte: end } });
    return issues;
  }

  /**
   * Find issues by modification time range
   *
   * @param {Date} start - Start of modification time range
   * @param {Date} end - End of modification time range
   * @returns issues
   */
  static async getIssuesByModificationTimeRange(start, end) {
    await Connection.open();
    const issues = await IssueMap.find({ modificationTime: { $gte: start, $lte: end } });
    return issues;
  }

  /**
   * Find and remove article from given issue
   *
   * @param {Number} issueNumber - Issue number to remove from
   * @param {String} articleSlug - Article slug to remove
   * @returns the updated issues
   */
  static async removeArticleFromIssue(issueNumber, articleSlug) {
    await Connection.open();

    //get article needed to remove
    const article = await Article.findOne({ slug: articleSlug });
    if (!article) {
      throw new ErrorArticleNotFound();
    }

    const existingIssue = await IssueMap.findOne({
      issueNumber: issueNumber,
      articles: article._id,
    });

    //article slug exists, but not in this issue
    if (!existingIssue) {
      throw new ErrorInvalidArticleAndIssueCombination();
    }

    //remove the article from the issue using object id
    const updatedIssue = await IssueMap.findOneAndUpdate(
      { issueNumber: issueNumber },
      { $pull: { articles: article._id } },
      { new: true }
    );

    return updatedIssue;
  }
}
