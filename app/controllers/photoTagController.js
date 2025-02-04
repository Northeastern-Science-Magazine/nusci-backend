import { PhotoTagCreate, PhotoTagResponse } from "../models/apiModels/photoTag.js";
import PhotoTagAccessor from "../databaseAccessors/photoTagAccessor.js";
import { photoTagResponse } from "../models/validationSchemas/photoTag.js";
import Validate from "../models/validationSchemas/validateSchema.js";
import { ErrorDuplicateKey, ErrorUnexpected, ErrorPhotoTagNotFound, HttpError } from "../error/errors.js";
import UsersAccessor from "../databaseAccessors/userAccessor.js";
import Utils from "../controllers/utils.js"
import User from "../models/dbModels/user.js";
import user from "../routes/userRoutes.js";
import { userPublicResponse } from "../models/validationSchemas/user.js";

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
}
