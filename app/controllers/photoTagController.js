import { PhotoTagCreate, PhotoTagResponse } from "../models/apiModels/photoTag.js";
import PhotoTagAccessor from "../databaseAccessors/photoTagAccessor.js";
import { ErrorTagNameNotFound, ErrorDuplicateKey, ErrorUnexpected, HttpError } from "../error/errors.js";


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
      const tagCreate = new PhotoTagCreate(req.body);
      const tagByName = await PhotoTagAccessor.getTagByName(tagCreate.tagName);

      if (tagByName) {
        throw new ErrorDuplicateKey();
      }

      const newTag = await PhotoTagAccessor.createPhotoTag(tagCreate);
      const populatedNewTag = await PhotoTagAccessor.getTagById(newTag._id);
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

/**
 * Deletes a PhotoTag given the tagName within the url param
 *
 * @param {Request} req
 * @param {Response} res
 */
static async delete(req, res) {
    try {
      const tagName = req.params.tagName;
      const tag = await PhotoTagAccessor.getTagByName(tagName);

      if (!tag) { // if tag doesn't exist
        throw new ErrorTagNameNotFound();
      }
      const deletedTag = await PhotoTagAccessor.deletePhotoTag(tag);
      const deletedTagResponse = new PhotoTagResponse(deletedTag.toObject());
      res.status(200).json(deletedTagResponse);
    } catch (e) {
      if (e instanceof HttpError) {
        e.throwHttp(req, res);
      } else {
        new ErrorUnexpected(e.message).throwHttp(req, res);
      }
    }
  }
}
