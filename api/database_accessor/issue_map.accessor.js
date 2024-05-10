import IssueMap from "../models/issue_map.js";
import Connection from "../db/connection.js";
import mongoose from "mongoose";

export default class IssueMapAccessor {
  static async getAllIssues() {
    try {
      await Connection.open();
      const issues = await IssueMap.find({});
      return issues;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  static async getIssueByID(issueID) {
    try {
      await Connection.open();
      const issue = await IssueMap.findById(new mongoose.Types.ObjectId(issueID));
      return issue;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  static async getIssuesByNumber(issueNumber) {
    try {
      await Connection.open();
      const issue = await IssueMap.find({ issueNumber: issueNumber });
      return issue;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  static async getIssueByName(issueName) {
    try {
      await Connection.open();
      const issue = await IssueMap.findOne({ issueName: issueName });
      return issue;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  static async getIssuesByArticle(articleID) {
    try {
      await Connection.open();
      const issues = await IssueMap.find({ articles: { $in: [new mongoose.Types.ObjectId(articleID)] } });
      return issues;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  static async getIssuesByPagesRange(min, max) {
    try {
      await Connection.open();
      const issues = await IssueMap.find({ pages: { $gte: min, $lte: max } });
      return issues;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  static async getIssuesByUser(userID) {
    try {
      await Connection.open();
      const issues = await IssueMap.find({ creatingUser: new mongoose.Types.ObjectId(userID) });
      return issues;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  static async getIssuesByCreationTimeRange(start, end) {
    try {
      await Connection.open();
      const issues = await IssueMap.find({ creationTime: { $gte: start, $lte: end } });
      return issues;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  static async getIssuesByModificationTimeRange(start, end) {
    try {
      await Connection.open();
      const issues = await IssueMap.find({ modificationTime: { $gte: start, $lte: end } });
      return issues;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
}
