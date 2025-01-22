import { PhotoTagCreate, PhotoTagResponse } from "../models/apiModels/photoTag.js";
import PhotoTagAccessor from "../databaseAccessors/photoTagAccessor.js";
import { ErrorDuplicateKey, ErrorUnexpected, HttpError } from "../error/errors.js";
import UsersAccessor from "../databaseAccessors/userAccessor.js";
import User from "../models/dbModels/user.js";
import user from "../routes/userRoutes.js";


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
   * Filters PhotoTags by the given color and/or email, or returns all PhotoTags
   * @param {Request} req 
   * @param {Response} res 
   */
  static async filter(req, res) {
    try {
    const { color, userEmail } = req.body;
    console.log(color, userEmail)
    let photoTags = [];

    if (color && userEmail) {
      // get the tags by color 
      const photoTagByColor = await PhotoTagAccessor.getTagsByColor(color);
      // get the phototags by the given email  
      const photoTagsByEmail = await PhotoTagAccessorAccessor.getTagsByUser(userEmail);

      // filter the photo tags to find the tags by color and email
      photoTags = photoTagByColor.filter(photoTag => photoTagsByEmail.includes(photoTag))
    }
    // else get tags by color
    else if (color) {
      photoTags = await PhotoTagAccessor.getTagsByColor(color);
    }
    // else get tags by userEmail
    else if (userEmail) {
      photoTags = await PhotoTagAccessorAccessor.getTagsByUser(userEmail);
    }
    // else return all tags 
    else {
      photoTags = await PhotoTagAccessor.getAllTags();
    }
    // return success status code 
    res.status(200).json(photoTags);
    // or throw error
  } catch (e) {
    if (e instanceof HttpError) {
      e.throwHttp(req, res);
    } else {
      new ErrorUnexpected(e.message).throwHttp(req, res);
    }
  }

  }
}
