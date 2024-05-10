import PhotoTag from "../models/photo_tag.js";
import Connection from "../db/connection.js";
import mongoose from "mongoose";

export default class PhotoTagAccessor {
  static async getAllTags() {
    try {
      await Connection.open();
      const tags = await PhotoTag.find({});
      return tags;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  static async getTagByID(tagID) {
    try {
      await Connection.open();
      const tag = await PhotoTag.findById(new mongoose.Types.ObjectId(tagID));
      return tag;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  static async getTagByName(tagName) {
    try {
      await Connection.open();
      const tag = await PhotoTag.findOne({ tageName: tagName });
      return tag;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  static async getTagsByColor(color) {
    try {
      await Connection.open();
      const tags = await PhotoTag.find({ color: color });
      return tags;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  static async getTagsByUser(userID) {
    try {
      await Connection.open();
      const tags = await PhotoTag.find({ user: new mongoose.Types.ObjectId(userID) });
      return tags;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  static async getTagsByCreationTimeRange(start, end) {
    try {
      await Connection.open();
      const tags = await PhotoTag.find({ creationTime: { $gte: start, $lte: end } });
      return tags;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  static async getTagsByModificationTimeRange(start, end) {
    try {
      await Connection.open();
      const tags = await PhotoTag.find({ modificationTime: { $gte: start, $lte: end } });
      return tags;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
}
