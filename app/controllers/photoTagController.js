import { PhotoTagCreate, PhotoTagResponse } from "../models/apiModels/photoTag.js";
import PhotoTagAccessor from "../databaseAccessors/photoTagAccessor.js";
import { ErrorDuplicateKey, ErrorUnexpected, HttpError } from "../error/errors.js";
import UsersAccessor from "../databaseAccessors/userAccessor.js";
import Utils from "../controllers/utils.js"
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
      let photoTags = [];

      // get tags by color and email 
      if (color && userEmail) {
        // get the tags by color 
        const photoTagByColor = await PhotoTagAccessor.getTagsByColor(color);
        // get the user's id based on their email
        const decodedEmail = decodeURIComponent(userEmail);
        const userId = await Utils.getUserIdByEmail(decodedEmail)
        // get the phototags by the id
        const photoTagsById = await PhotoTagAccessor.getTagsByUserID(userId);
        // filter the photo tags to find the tags by color and email
        const photoTagsByColorAndEmail = photoTagByColor.filter(photoTag => 
          photoTagsById.some(tag => tag._id.toString() === photoTag._id.toString())
        );        
        photoTags = photoTagsByColorAndEmail;
      }
      // else get tags by color
      else if (color) {
        photoTags = await PhotoTagAccessor.getTagsByColor(color);
      }
      // else get tags by userEmail
      else if (userEmail) {
        const decodedEmail = decodeURIComponent(userEmail);
        const userId = await Utils.getUserIdByEmail(decodedEmail);
        photoTags = await PhotoTagAccessor.getTagsByUserID(userId);
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
