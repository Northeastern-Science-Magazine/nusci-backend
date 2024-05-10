import Photo from "../models/photo.js";
import Connection from "../db/connection.js";
import mongoose from "mongoose";

/**
 * PhotoAccessor Accessor Class
 *
 * Accesses the photos
 */
export default class PhotoAccessor {
  static async getAllPhotos() {
    try {
      await Connection.open();
      const photos = await Photo.find({});
      return photos;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  static async getPhotoByID(photoID) {
    try {
      await Connection.open();
      const photo = await Photo.findById(new mongoose.Types.ObjectId(photoID));
      return photo;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  static async getPhotoByUrl(url) {
    try {
      await Connection.open();
      const photo = await Photo.findOne({ url: url });
      return photo;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  static async getPhotosByTag(tagID) {
    try {
      await Connection.open();
      const photos = await Photo.find({ tags: { $in: [new mongoose.Types.ObjectId(tagID)] } });
      return photos;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  static async getPhotosByPhotographer(photographerID) {
    try {
      await Connection.open();
      const photos = await Photo.find({ photographers: { $in: [new mongoose.Types.ObjectId(photographerID)] } });
      return photos;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  static async getPhotosByTimeRange(startDate, endDate) {
    try {
      await Connection.open();
      const photos = await Photo.find({ photoTime: { $gte: startDate, $lte: endDate } });
      return photos;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  static async getPhotosWithRights(rights) {
    try {
      await Connection.open();
      const photos = await Photo.find({ rights: rights });
      return photos;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  static async getPhotosByCreationTimeRange(start, end) {
    try {
      await Connection.open();
      const photos = await Photo.find({ creationTime: { $gte: start, $lte: end } });
      return photos;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  static async getPhotosByModificationTimeRange(start, end) {
    try {
      await Connection.open();
      const photos = await Photo.find({ modificationTime: { $gte: start, $lte: end } });
      return photos;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
}