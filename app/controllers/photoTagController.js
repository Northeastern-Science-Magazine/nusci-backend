import PhotoTagAccessor from "../databaseAccessors/photoTagAccessor.js";
import { ErrorDuplicateKey, ErrorPhotoTagNotFound, ErrorUnexpected, ErrorValidation, HttpError } from "../error/errors.js";
import { PhotoTagCreate, PhotoTagResponse } from "../models/zodSchemas/photoTag.js";

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
      const tagCreate = PhotoTagCreate.safeParse(req.body);
      
      if (!tagCreate.success) {
        throw new ErrorValidation("Photo tag creation failed.");
      }

      const tagByName = await PhotoTagAccessor.getTagByName(tagCreate.data.tagName);

      if (tagByName) {
        throw new ErrorDuplicateKey();
      }

      const newTag = await PhotoTagAccessor.createPhotoTag(tagCreate.data);
      const populatedNewTag = await PhotoTagAccessor.getTagById(newTag._id);
      const newTagResponse = PhotoTagResponse.safeParse(populatedNewTag.toObject());

      if (!newTagResponse.success) {
        throw new ErrorValidation("Photo tag response validation failed.");
      }

      res.status(201).json(newTagResponse.data);
    } catch (e) {
      if (e instanceof HttpError) {
        e.throwHttp(req, res);
      } else {
        new ErrorUnexpected(e.message).throwHttp(req, res);
      }
    }
  }

  /**
   *
   * @param {Request} req
   * @param {Response} res
   */
  static async getTagByName(req, res) {
    try {

      const tagName = req.params.tagName;

      const photoTag = await PhotoTagAccessor.getTagByName(tagName).then((_) => _?.toObject());
      if (!photoTag) {
        //return the photoTag not found error here: or else ErrorValidation will also be
        // thrown due to null response from getTagByName when using .toObject() on null.
        throw new ErrorPhotoTagNotFound();
      }
    
      const photoTagResponse = PhotoTagResponse.safeParse(photoTag);
      if (!photoTagResponse.success) {
        throw new ErrorValidation("Photo tag response validation failed.");
      }

      res.status(200).json(photoTagResponse.data);
    } catch (e) {
      if (e instanceof HttpError) {
        e.throwHttp(req, res);
      } else {
        new ErrorUnexpected(e.message).throwHttp(req, res);
      }
    }
  }
}
