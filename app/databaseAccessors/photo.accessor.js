import Photo from "../models/dbModels/photo.js";
import Connection from "../db/connection.js";
import mongoose from "mongoose";

/**
 * PhotoAccessor Accessor Class
 *
 * Accesses the photos
 */
export default class PhotoAccessor {
  /**
   * Get all photos
   *
   * @returns all photos
   */
  static async getAllPhotos() {
    await Connection.open();
    const photos = await Photo.find({});
    return photos;
  }

  /**
   * Find photo by its ID
   *
   * @param {ObjectID} photoID - The ID of the photo
   * @returns Photo
   */
  static async getPhotoByID(photoID) {
    await Connection.open();
    const photo = await Photo.findById(new mongoose.Types.ObjectId(photoID));
    return photo;
  }

  /**
   * Find photo by its URL
   *
   * @param {String} url - The URL of the photo
   * @returns Photo
   */
  static async getPhotoByUrl(url) {
    await Connection.open();
    const photo = await Photo.findOne({ url: url });
    return photo;
  }

  /**
   * Find photos by tag
   *
   * @param {ObjectID} tagID - The ID of the tag
   * @returns photos
   */
  static async getPhotosByTag(tagID) {
    await Connection.open();
    const photos = await Photo.find({ tags: { $in: [new mongoose.Types.ObjectId(tagID)] } });
    return photos;
  }

  /**
   * Find photos by photographer
   *
   * @param {ObjectID} photographerID - The ID of the photographer
   * @returns photos
   */
  static async getPhotosByPhotographer(photographerID) {
    await Connection.open();
    const photos = await Photo.find({ photographers: { $in: [new mongoose.Types.ObjectId(photographerID)] } });
    return photos;
  }

  /**
   * Find photos by time range
   *
   * @param {Date} startDate - Start of time range
   * @param {Date} endDate - End of time range
   * @returns photos
   */
  static async getPhotosByTimeRange(startDate, endDate) {
    await Connection.open();
    const photos = await Photo.find({ photoTime: { $gte: startDate, $lte: endDate } });
    return photos;
  }

  /**
   * Find photos with specific rights
   *
   * @param {String} rights - The rights of the photos
   * @returns photos
   */
  static async getPhotosWithRights(rights) {
    await Connection.open();
    const photos = await Photo.find({ rights: rights });
    return photos;
  }

  /**
   * @TODO Assume start time is always passed in. If two parameters.
   * then assume first param start, and second param end.
   *
   * Find photos by creation time range
   *
   * @param {Date} start - Start of creation time range
   * @param {Date} end - End of creation time range
   * @returns photos
   */
  static async getPhotosByCreationTimeRange(start, end) {
    await Connection.open();
    const photos = await Photo.find({ creationTime: { $gte: start, $lte: end } });
    return photos;
  }

  /**
   * @TODO Assume start time is always passed in. If two parameters.
   * then assume first param start, and second param end.
   *
   * Find photos by modification time range
   *
   * @param {Date} start - Start of modification time range
   * @param {Date} end - End of modification time range
   * @returns photos
   */
  static async getPhotosByModificationTimeRange(start, end) {
    await Connection.open();
    const photos = await Photo.find({ modificationTime: { $gte: start, $lte: end } });
    return photos;
  }
}
