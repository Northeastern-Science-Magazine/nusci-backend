import PhotoTag from "../models/dbModels/photoTag.js";
import Connection from "../db/connection.js";
import mongoose from "mongoose";

/**
 * PhotoTag Accessor Class
 *
 * Accesses the photo tags
 */
export default class PhotoTagAccessor {
  /**
   * creates a new photo tag
   *
   * @param {Object} tag - an instance of a PhotoTag model
   * @return a new photo tag
   */
  static async createPhotoTag(tag) {
    await Connection.open();
    const createTag = await PhotoTag.create(tag);
    return createTag;
  }

  /**
   * Get all tags
   *
   * @returns all tags
   */
  static async getAllTags() {
    await Connection.open();
    const tags = await PhotoTag.find({});
    return tags;
  }

  /**
   * Find and returns populated tag by its Id
   *
   * @param {ObjectID} tagId - The ID of the tag
   * @returns Tag with populated field
   */
  static async getTagById(tagId) {
    await Connection.open();
    const tag = await PhotoTag.findById(new mongoose.Types.ObjectId(tagId)).populate("creatingUser");
    return tag;
  }

  /**
   * Find tag by its name
   *
   * @param {String} tagName - The name of the tag
   * @returns Tag
   */
  static async getTagByName(tagName) {
    await Connection.open();
    const tag = await PhotoTag.findOne({ tagName: tagName });
    return tag;
  }

  /**
   * Find tags by color
   *
   * @param {String} color - The color of the tag
   * @returns tags
   */
  static async getTagsByColor(color) {
    await Connection.open();
    const tags = await PhotoTag.find({ color: color });
    return tags;
  }

  /**
   * Find tags by user
   *
   * @param {String} userID - The ID of the user
   * @returns tags
   */
  static async getTagsByUserID(userID) {
    await Connection.open();
    const tags = await PhotoTag.find({ creatingUser: new mongoose.Types.ObjectId(userID) });
    return tags;
  }

  /**
   * Find tags by creation time range
   *
   * @param {Date} start - Start of creation time range
   * @param {Date} end - End of creation time range
   * @returns tags
   */
  static async getTagsByCreationTimeRange(start, end) {
    await Connection.open();
    const tags = await PhotoTag.find({ creationTime: { $gte: start, $lte: end } });
    return tags;
  }

  /**
   * Find tags by modification time range
   *
   * @param {Date} start - Start of modification time range
   * @param {Date} end - End of modification time range
   * @returns tags
   */
  static async getTagsByModificationTimeRange(start, end) {
    await Connection.open();
    const tags = await PhotoTag.find({ modificationTime: { $gte: start, $lte: end } });
    return tags;
  }

   /**
   * Find tags by user's email 
   *
   * @param {String} user email - The email of the user 
   * @returns tags
   */
   static async getTagsByUser(userEmail) {
    await Connection.open();
    const tags = await PhotoTag.find({ user: new mongoose.Types.ObjectId(userEmail) });
    return tags;
  }
}
