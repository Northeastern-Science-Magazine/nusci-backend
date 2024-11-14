import { PhotoTagCreate, PhotoTagResponse } from "../models/apiModels/photoTag.js";
import PhotoTagAccessor from "../databaseAccessors/photoTagAccessor.js";
import { ErrorUnexpected, HttpError } from "../error/errors.js";


/**
 * PhotoTagController Class
 *
 * This class controls the behaviour of any web request
 * related to PhotoTags
 */
export default class PhotoTagController {
  /**
   * Creates a PhotoTag with ref fields populated
   *
   * @param {Request} req
   * @param {Response} res
   */
  static async create(req, res) {
    try {
      const tagBody = new PhotoTagCreate(req.body);
      const newTag = await PhotoTagAccessor.createPhotoTag(tagBody);
      const populatedNewTag = await PhotoTagAccessor.getTagByID(newTag._id);
      const newTagResponse = new PhotoTagResponse(populatedNewTag.toObject());
      
      res.status(201).json(newTagResponse); 
    } catch (e) {
      if (e instanceof HttpError) {
        e.throwHttp(req, res);
      } else {
        new ErrorUnexpected(e.message).throwHttp(req, res);
      }
    }
  }
}
