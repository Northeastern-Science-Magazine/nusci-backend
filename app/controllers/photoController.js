import PhotoAccessor from "../databaseAccessors/photo.accessor.js";
// import { PhotoCreate, PhotoResponse } from "../models/apiModels/photo.js";
import UsersAccessor from "../databaseAccessors/userAccessor.js";
import PhotoTagAccessor from "../databaseAccessors/photoTagAccessor.js";
import Validate from "../models/validationSchemas/validateSchema.js";
import { PhotoResponse } from "..models/validationSchemas/photo.js";
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
          photoTime: { type: date, default: now },
          rights: { type: string, required: true, default: "" },
          creationTime: { type: date, default: now, required: true },
          modificationTime: { type: date, default: now, required: true },
        },
        { override: ["creationTime", "modificationTime"] }
      );
      // create a PhotoCreate object from the request
      const photoCreate = new PhotoResponse(req.body);
      // fetch users
      const fetchUsers = async (emails, role) => {
        const userIDs = await UsersAccessor.getUserIdsByEmail(emails);
        if (userIDs.length !== emails.length) {
          throw new ErrorInvalidRequestBody(`Invalid ${role} emails`);
        }
        return userIDs;
      };
      // fetch tags
      const fetchTags = async (tagNames) => {
        const tagIDs = await PhotoTagAccessor.getTagIdsByName(tagNames);
        if (tagIDs.length !== tagNames.length) {
          throw new ErrorInvalidRequestBody(`Invalid tag names`);
        }
        return tagIDs;
      };
      const { url, tags, photographers, photoTime, rights, creationTime, modificationTime } = photoCreate;
      // fetch the photographers
      const photographerUsers = await fetchUsers(photographers, "photographers");
      // fetch the photo tags
      const photoTags = await fetchTags(tags);
      // create a new photo using the photographers and photo tags
      const newPhoto = {
        url: url,
        tags: photoTags,
        photographers: photographerUsers,
        photoTime: photoTime,
        rights: rights,
        creationTime: creationTime,
        modificationTime: modificationTime,
      };
      // create the photo
      const createdPhoto = await PhotoAccessor.createPhoto(newPhoto);
      // fetch photo information with populated objects
      const populatedCreatedPhoto = await PhotoAccessor.getPhotoByID(createdPhoto._id);
      // create a new photo response
      // const newPhotoResponse = new PhotoResponse(populatedCreatedPhoto.toObject());
      // validation
      Validate.outgoing(populatedCreatedPhoto, PhotoResponse);
      // return
      return res.status(201).json(populatedCreatedPhoto);
    } catch (e) {
      if (e instanceof HttpError) {
        e.throwHttp(req, res);
      } else {
        new ErrorUnexpected(e.message).throwHttp(req, res);
      }
    }
  }

  // static async addPhotoByFile(req, res) {
  //   try {
  //     const newPhoto = new PhotoCreate(req.body);
  //     const createdPhoto = await Photo.create(newPhoto);
  //     return res.status(200).json(createdPhoto);
  //   } catch (e) {
  //     if (e instanceof HttpError) {
  //       e.throwHttp(req, res);
  //     } else {
  //       new ErrorUnexpected(e.message).throwHttp(req, res);
  //     }
  //   }
  // }
}
