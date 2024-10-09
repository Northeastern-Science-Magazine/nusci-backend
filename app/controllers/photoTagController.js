import { PhotoTagCreate, PhotoTagResponse } from "../models/apiModels/photoTag.js";
import PhotoTagAccessor from "../databaseAccessors/photoTagAccessor.js";
import { ErrorRepeatedTagName, ErrorUnexpected, HttpError } from "../error/errors.js";


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
      const body = new PhotoTagCreate(req.body);
      
      // if creating a tag that already exists
      const listOfTags = await PhotoTagAccessor.getAllTags();
      if (listOfTags.map((tag) => tag.tagName).includes(body.tagName)) {
        throw new ErrorRepeatedTagName();
      } 
      const creator = body.creatingUser; // assuming creatingUser is the userID
      const newTag = await PhotoTagAccessor.createPhotoTag(body);
      const updateNewTag = await PhotoTagAccessor.updatePhotoTag(newTag._id, creator);
      const newTagResponse = new PhotoTagResponse(updateNewTag.toObject());
      
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
