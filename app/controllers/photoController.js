import PhotoAccessor from "../databaseAccessors/photo.accessor.js";
import { PhotoCreate } from "../models/apiModels/photo.js";

/**
 * PhotoController Class
 *
 * This class controls the behaviour of any web request
 * related to Photos.
 */
export default class PhotoController {
  /**
   * method to create and add a photo by URL
   *
   * Create and add a photo by URL
   *
   * @param {Request} req
   * @param {Response} res
   */
  static async addPhotoByURL(req, res) {
    try {
      const {
        tags,
        photographers,
        internalPhotographer,
        license = "By uploading this photo, I guarantee that I have the express permission by the owner of this photo to use this photo and share it publicly and/or that this photo falls under the Creative Commons License.",
        url,
        photoTime,
      } = req.body;

      // const newPhoto = {
      //     tags: tags,
      //     photographers: photographers,
      //     internalPhotographer: internalPhotographer,
      //     license: license,
      //     url: url,
      //     photoTime: photoTime,
      //     creationTime: new Date(),
      //     modificationTime: new Date(),
      // };

      const newPhoto = new PhotoCreate(req.body);

      const createdPhoto = await PhotoAccessor.create(newPhoto);
      // validation
      return res.status(200).json(createdPhoto);
    } catch (e) {
      if (e instanceof HttpError) {
        e.throwHttp(req, res);
      } else {
        new ErrorUnexpected(e.message).throwHttp(req, res);
      }
    }
  }

  static async addPhotoByFile(req, res) {
    try {
      const newPhoto = new PhotoCreate(req.body);
      const createdPhoto = await Photo.create(newPhoto);
      return res.status(200).json(createdPhoto);
    } catch (e) {
      if (e instanceof HttpError) {
        e.throwHttp(req, res);
      } else {
        new ErrorUnexpected(e.message).throwHttp(req, res);
      }
    }
  }
}
