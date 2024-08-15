import Photo from "../models/photo.js";
import Connection from "../db/connection.js";
import mongoose from "mongoose";
import { ErrorInternalDatabaseConnection } from "../error/internalErrors.js";

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
    try {
      await Connection.open();
      const photos = await Photo.find({});
      return photos;
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
   * Find photo by its ID
   *
   * @param {ObjectID} photoID - The ID of the photo
   * @returns Photo
   */
  static async getPhotoByID(photoID) {
    try {
      await Connection.open();
      const photo = await Photo.findById(new mongoose.Types.ObjectId(photoID));
      return photo;
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
   * Find photo by its URL
   *
   * @param {String} url - The URL of the photo
   * @returns Photo
   */
  static async getPhotoByUrl(url) {
    try {
      await Connection.open();
      const photo = await Photo.findOne({ url: url });
      return photo;
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
   * Find photos by tag
   *
   * @param {ObjectID} tagID - The ID of the tag
   * @returns photos
   */
  static async getPhotosByTag(tagID) {
    try {
      await Connection.open();
      const photos = await Photo.find({ tags: { $in: [new mongoose.Types.ObjectId(tagID)] } });
      return photos;
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
   * Find photos by photographer
   *
   * @param {ObjectID} photographerID - The ID of the photographer
   * @returns photos
   */
  static async getPhotosByPhotographer(photographerID) {
    try {
      await Connection.open();
      const photos = await Photo.find({ photographers: { $in: [new mongoose.Types.ObjectId(photographerID)] } });
      return photos;
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
   * Find photos by time range
   *
   * @param {Date} startDate - Start of time range
   * @param {Date} endDate - End of time range
   * @returns photos
   */
  static async getPhotosByTimeRange(startDate, endDate) {
    try {
      await Connection.open();
      const photos = await Photo.find({ photoTime: { $gte: startDate, $lte: endDate } });
      return photos;
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
   * Find photos with specific rights
   *
   * @param {String} rights - The rights of the photos
   * @returns photos
   */
  static async getPhotosWithRights(rights) {
    try {
      await Connection.open();
      const photos = await Photo.find({ rights: rights });
      return photos;
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
    try {
      await Connection.open();
      const photos = await Photo.find({ creationTime: { $gte: start, $lte: end } });
      return photos;
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
    try {
      await Connection.open();
      const photos = await Photo.find({ modificationTime: { $gte: start, $lte: end } });
      return photos;
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
