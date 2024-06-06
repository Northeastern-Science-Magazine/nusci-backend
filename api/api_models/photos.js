import { BaseModel, string, date } from "./base_model.js";
import Photography_status from "../models/enums/photography_status.js";
import { ErrorInternalAPIModelValidation } from "../error/internal_errors.js";

/**
 * Represents the http request body required
 * to create a photo in the database.
 */
export class PhotoCreate extends BaseModel{
    static schema = {
        url: { type: String, unique: true, required: true },
        tags: [{ type: Schema.Types.ObjectId, ref: "PhotoTags" }],
        photographers: [{ type: Schema.Types.ObjectId, ref: "Users", required: true }],
        photoTime: { type: Date, default: Date.now() },
        rights: { type: String, required: true, default: "" },
        creationTime: { type: Date, default: Date.now(), required: true },
        modificationTime: { type: Date, default:Date.now(), required: true },}

    constructor(json) {
        super(json, PhotoCreate.schema);
      } catch(e) {
        throw new ErrorInternalAPIModelValidation(e.message);
      }
}

/**
 * Represents the http response body returned to a frontend with no private data.
 */
export class PhotoResponse extends BaseModel{
    static schema = {
        url: { type: String, unique: true, required: true },
        tags: [{ type: Schema.Types.ObjectId, ref: "PhotoTags" }],
        photographers: [{ type: Schema.Types.ObjectId, ref: "Users", required: true }],
        photoTime: { type: Date, default: Date.now() },
        rights: { type: String, required: true, default: "" },
        creationTime: { type: Date, default: Date.now(), required: true },
        modificationTime: { type: Date, default:Date.now(), required: true },}
    constructor(json) {
        super(json, PhotoResponse.schema);
      } catch(e) {
        throw new ErrorInternalAPIModelValidation(e.message);
      }
}

export class PhotoUpdate extends BaseModel{
    static schema = {
        url: { type: String, unique: true, required: true },
        tags: [{ type: Schema.Types.ObjectId, ref: "PhotoTags" }],
        photographers: [{ type: Schema.Types.ObjectId, ref: "Users", required: true }],
        photoTime: { type: Date, default: Date.now() },
        rights: { type: String, required: true, default: "" },
        creationTime: { type: Date, default: Date.now(), required: true },
        modificationTime: { type: Date, default:Date.now(), required: true },}

    constructor(json) {
        super(json, PhotoUpdate.schema);
      } catch(e) {
        throw new ErrorInternalAPIModelValidation(e.message);
      } 
}

export class PhotoDelete extends BaseModel{
    static schema = {
        url: { type: String, unique: true, required: true },
        tags: [{ type: Schema.Types.ObjectId, ref: "PhotoTags" }],
        photographers: [{ type: Schema.Types.ObjectId, ref: "Users", required: true }],
        photoTime: { type: Date, default: Date.now() },
        rights: { type: String, required: true, default: "" },
        creationTime: { type: Date, default: Date.now(), required: true },
        modificationTime: { type: Date, default: Date.now(), required: true },}

    constructor(json) {
        super(json, PhotoDelete.schema);
      } catch(e) {
        throw new ErrorInternalAPIModelValidation(e.message);
      } 
}




    
