import IssueMap from "../models/issue_map.js";
import Connection from "../db/connection.js";
import mongoose from "mongoose";
import { ErrorInternalDatabaseConnection } from "../error/internalErrors.js";

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
    try {
      await Connection.open();
      const issues = await IssueMap.find({});
      return issues;
    } catch (e) {
      if (e instanceof ErrorInternalDatabaseConnection) {
        // Throw up the stack
        throw e;
      } else {
        // Else throw unexpected error
        throw new ErrorInternalUnexpected("Unexpected error occurred");
      }
    }
  }

  /**
   * Find issue by its ID
   *
   * @param {ObjectID} issueID - The ID of the issue
   * @returns Issue
   */
  static async getIssueByID(issueID) {
    try {
      await Connection.open();
      const issue = await IssueMap.findById(new mongoose.Types.ObjectId(issueID));
      return issue;
    } catch (e) {
      if (e instanceof ErrorInternalDatabaseConnection) {
        // Throw up the stack
        throw e;
      } else {
        // Else throw unexpected error
        throw new ErrorInternalUnexpected("Unexpected error occurred");
      }
    }
  }

  /**
   * Find issues by issue number
   *
   * @param {Number} issueNumber - The issue number
   * @returns issues
   */
  static async getIssuesByNumber(issueNumber) {
    try {
      await Connection.open();
      const issue = await IssueMap.find({ issueNumber: issueNumber });
      return issue;
    } catch (e) {
      if (e instanceof ErrorInternalDatabaseConnection) {
        // Throw up the stack
        throw e;
      } else {
        // Else throw unexpected error
        throw new ErrorInternalUnexpected("Unexpected error occurred");
      }
    }
  }

  /**
   * Find issue by its name
   *
   * @param {String} issueName - The name of the issue
   * @returns Issue
   */
  static async getIssueByName(issueName) {
    try {
      await Connection.open();
      const issue = await IssueMap.findOne({ issueName: issueName });
      return issue;
    } catch (e) {
      if (e instanceof ErrorInternalDatabaseConnection) {
        // Throw up the stack
        throw e;
      } else {
        // Else throw unexpected error
        throw new ErrorInternalUnexpected("Unexpected error occurred");
      }
    }
  }

  /**
   * Find issues by article
   *
   * @param {ObjectID} articleID - The ID of the article
   * @returns issues
   */
  static async getIssuesByArticle(articleID) {
    try {
      await Connection.open();
      const issues = await IssueMap.find({ articles: { $in: [new mongoose.Types.ObjectId(articleID)] } });
      return issues;
    } catch (e) {
      if (e instanceof ErrorInternalDatabaseConnection) {
        // Throw up the stack
        throw e;
      } else {
        // Else throw unexpected error
        throw new ErrorInternalUnexpected("Unexpected error occurred");
      }
    }
  }

  /**
   * Find issues by pages range
   *
   * @param {Number} min - Minimum number of pages
   * @param {Number} max - Maximum number of pages
   * @returns issues
   */
  static async getIssuesByPagesRange(min, max) {
    try {
      await Connection.open();
      const issues = await IssueMap.find({ pages: { $gte: min, $lte: max } });
      return issues;
    } catch (e) {
      if (e instanceof ErrorInternalDatabaseConnection) {
        // Throw up the stack
        throw e;
      } else {
        // Else throw unexpected error
        throw new ErrorInternalUnexpected("Unexpected error occurred");
      }
    }
  }

  /**
   * Find issues by user
   *
   * @param {String} userID - The ID of the user
   * @returns issues
   */
  static async getIssuesByUser(userID) {
    try {
      await Connection.open();
      const issues = await IssueMap.find({ creatingUser: new mongoose.Types.ObjectId(userID) });
      return issues;
    } catch (e) {
      if (e instanceof ErrorInternalDatabaseConnection) {
        // Throw up the stack
        throw e;
      } else {
        // Else throw unexpected error
        throw new ErrorInternalUnexpected("Unexpected error occurred");
      }
    }
  }

  /**
   * Find issues by creation time range
   *
   * @param {Date} start - Start of creation time range
   * @param {Date} end - End of creation time range
   * @returns issues
   */
  static async getIssuesByCreationTimeRange(start, end) {
    try {
      await Connection.open();
      const issues = await IssueMap.find({ creationTime: { $gte: start, $lte: end } });
      return issues;
    } catch (e) {
      if (e instanceof ErrorInternalDatabaseConnection) {
        // Throw up the stack
        throw e;
      } else {
        // Else throw unexpected error
        throw new ErrorInternalUnexpected("Unexpected error occurred");
      }
    }
  }

  /**
   * Find issues by modification time range
   *
   * @param {Date} start - Start of modification time range
   * @param {Date} end - End of modification time range
   * @returns issues
   */
  static async getIssuesByModificationTimeRange(start, end) {
    try {
      await Connection.open();
      const issues = await IssueMap.find({ modificationTime: { $gte: start, $lte: end } });
      return issues;
    } catch (e) {
      if (e instanceof ErrorInternalDatabaseConnection) {
        // Throw up the stack
        throw e;
      } else {
        // Else throw unexpected error
        throw new ErrorInternalUnexpected("Unexpected error occurred");
      }
    }
  }
}
