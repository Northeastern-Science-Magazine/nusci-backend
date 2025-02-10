import PhotoAccessor from "../databaseAccessors/photo.accessor.js";
import UsersAccessor from "../databaseAccessors/userAccessor.js";
import PhotoTagAccessor from "../databaseAccessors/photoTagAccessor.js";
import Validate from "../models/validationSchemas/validateSchema.js";
import { photoPublicResponse, photoCreate } from "../models/validationSchemas/photo.js";
import { photoTagPublicResponse } from "../models/validationSchemas/photoTag.js";
import { userPublicResponse } from "../models/validationSchemas/user.js";

import { string, date, array, integer } from "../models/validationSchemas/schemaTypes.js";

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
      Validate.incoming(
        req.body,
        {
          url: { type: string, required: true },
          tags: { type: [string], required: true },
          photographers: { type: [string], required: true },
          photoTime: { type: date, default: new Date() },
          rights: { type: string, required: true, default: "" },
          creationTime: { type: date, required: true },
          modificationTime: { type: date, required: true },
        },
        { override: ["creationTime", "modificationTime"] }
      );

      // fetch user ids 
      const fetchUsers = async (emails, role) => {
        const userIDs = await UsersAccessor.getUserIdsByEmail(emails);
        if (userIDs.length !== emails.length) {
          throw new ErrorInvalidRequestBody(`Invalid ${role} emails`);
        }
        return userIDs;
      };

      // fetch tag ids 
      const fetchTags = async (tagNames) => {
        const tagIDs = await PhotoTagAccessor.getTagIdsByName(tagNames);
        if (tagIDs.length !== tagNames.length) {
          throw new ErrorInvalidRequestBody(`Invalid tag names`);
        }
        return tagIDs;
      };
      
      // fetch user ids and tag ids 
      req.body.photographers =  await fetchUsers(req.body.photographers, "photographers");
      req.body.tags = await fetchTags(req.body.tags);
      
      // create photo
      const createdPhoto = await PhotoAccessor.createPhoto(req.body);
      const populatedCreatedPhoto = await PhotoAccessor.getPhotoByID(createdPhoto._id).then((_) => _?.toObject());  
      
      // validate the photo 
      Validate.outgoing(populatedCreatedPhoto, photoPublicResponse);

      // validate the tags 
      populatedCreatedPhoto.tags.forEach(tag => {
        Validate.outgoing(tag, photoTagPublicResponse); 
        Validate.outgoing(tag.creatingUser, userPublicResponse);  
      }); 

      // validate the photographers 
      populatedCreatedPhoto.photographers.forEach(user => Validate.outgoing(user, userPublicResponse));

      return res.status(201).json(populatedCreatedPhoto);
    } catch (e) {
      if (e instanceof HttpError) {
        e.throwHttp(req, res);
      } else {
        new ErrorUnexpected(e.message).throwHttp(req, res);
      }
    }
  }
}
