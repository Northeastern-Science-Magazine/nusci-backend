import { PhotoTagCreate, PhotoTagResponse } from "../models/apiModels/photoTag.js";
import PhotoTagAccessor from "../databaseAccessors/photoTagAccessor.js";
import { ErrorRepeatedTagName, ErrorValidation } from "../error/errors.js";

/**
 * PhotoTagController Class
 *
 * This class controls the behaviour of any web request
 * related to PhotoTags
 */
export default class PhotoTagController {
    static async create(req, res) {
        try {
            const create = new PhotoTagCreate(req.body);
            const listOfTags = await PhotoTagAccessor.getAllTags();

            if (listOfTags.map((tag) => tag.tagName).includes(create.tagName)) {
                return ErrorRepeatedTagName.throwHttp(req, res); 
            }
            const newTag = await PhotoTagAccessor.createPhotoTag(create); 
            const newTagResponse = new PhotoTagResponse(newTag.toObject());
            res.status(201).json(newTagResponse);
        } catch (e) {
            console.log(e);
            ErrorValidation.throwHttp(req, res);
        }
    }

}
