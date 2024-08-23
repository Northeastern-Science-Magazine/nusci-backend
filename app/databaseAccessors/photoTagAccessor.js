import PhotoTag from "../models/dbModels/photoTag.js";
import Connection from "../db/connection.js";
import mongoose from "mongoose";
import { ErrorInternalDatabaseAccessor } from "../error/internalErrors.js";

/**
 * PhotoTag Accessor Class
 *
 * Accesses the photo tags
 */
export default class PhotoTagAccessor {

  static async createPhotoTag(tag) {
    try {
      await Connection.open();
      const createTag = await PhotoTag.create(tag);
      return createTag;
    } catch (e) {
      console.error(e);
      throw ErrorInternalDatabaseAccessor(e);
    }
  }
  
  /**
   * Get all tags
   *
   * @returns all tags
   */
  static async getAllTags() {
    try {
      await Connection.open();
      const tags = await PhotoTag.find({});
      return tags;
    } catch (e) {
      console.error(e);
      ErrorInternalAPIModelFieldValidation(e);
    }
  }

  /**
   * Find tag by its ID
   *
   * @param {ObjectID} tagID - The ID of the tag
   * @returns Tag
   */
  static async getTagByID(tagID) {
    try {
      await Connection.open();
      const tag = await PhotoTag.findById(new mongoose.Types.ObjectId(tagID));
      return tag;
    } catch (e) {
      console.error(e);
      ErrorInternalAPIModelFieldValidation(e);
    }
  }

  /**
   * Find tag by its name
   *
   * @param {String} tagName - The name of the tag
   * @returns Tag
   */
  static async getTagByName(tagName) {
    try {
      await Connection.open();
      const tag = await PhotoTag.findOne({ tagName: tagName });
      return tag;
    } catch (e) {
      console.error(e);
      ErrorInternalAPIModelFieldValidation(e);
    }
  }

  /**
   * Find tags by color
   *
   * @param {String} color - The color of the tag
   * @returns tags
   */
  static async getTagsByColor(color) {
    try {
      await Connection.open();
      const tags = await PhotoTag.find({ color: color });
      return tags;
    } catch (e) {
      console.error(e);
      ErrorInternalAPIModelFieldValidation(e);
    }
  }

  /**
   * Find tags by user
   *
   * @param {String} userID - The ID of the user
   * @returns tags
   */
  static async getTagsByUser(userID) {
    try {
      await Connection.open();
      const tags = await PhotoTag.find({ user: new mongoose.Types.ObjectId(userID) });
      return tags;
    } catch (e) {
      console.error(e);
      ErrorInternalAPIModelFieldValidation(e);
    }
  }

  /**
   * Find tags by creation time range
   *
   * @param {Date} start - Start of creation time range
   * @param {Date} end - End of creation time range
   * @returns tags
   */
  static async getTagsByCreationTimeRange(start, end) {
    try {
      await Connection.open();
      const tags = await PhotoTag.find({ creationTime: { $gte: start, $lte: end } });
      return tags;
    } catch (e) {
      console.error(e);
      ErrorInternalAPIModelFieldValidation(e);
    }
  }

  /**
   * Find tags by modification time range
   *
   * @param {Date} start - Start of modification time range
   * @param {Date} end - End of modification time range
   * @returns tags
   */
  static async getTagsByModificationTimeRange(start, end) {
    try {
      await Connection.open();
      const tags = await PhotoTag.find({ modificationTime: { $gte: start, $lte: end } });
      return tags;
    } catch (e) {
      console.error(e);
      ErrorInternalAPIModelFieldValidation(e);
    }
  }
}
