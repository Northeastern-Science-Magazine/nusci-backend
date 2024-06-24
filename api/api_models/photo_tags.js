import { BaseModel, string, date } from "./base_model.js";
import Photography_status from "../models/enums/photography_status.js";
import { ErrorInternalAPIModelValidation } from "../error/internal_errors.js";

export class PhotoTagsCreate extends BaseModel{
    static schema ={
    tagName: { type: String, unique: true, required: true},
    color: { type: String, required: true},
    creatingUser: { type: Schema.Types.ObjectId, required: true},
    creationTime: { type: Date, required: true },
    modificationTime: { type: Date, required: true }}
    

    constructor(json) {
        super(json, PhotoTagsCreate.schema);
      } catch(e) {
        throw new ErrorInternalAPIModelValidation(e.message);
      }
}

export class PhotoTagsResponse extends BaseModel{
    static schema ={
    tagName: { type: String, unique: true, required: true},
    color: { type: String, required: true},
    creatingUser: { type: Schema.Types.ObjectId, required: true},
    creationTime: { type: Date, required: true },
    modificationTime: { type: Date, required: true }}
    

    constructor(json) {
        super(json, PhotoTagsResponse.schema);
      } catch(e) {
        throw new ErrorInternalAPIModelValidation(e.message);
      }
}


export class PhotoTagsUpdate extends BaseModel{
    static schema ={
    tagName: { type: String, unique: true, required: true},
    color: { type: String, required: true},
    creatingUser: { type: Schema.Types.ObjectId, required: true},
    creationTime: { type: Date, required: true },
    modificationTime: { type: Date, required: true }}
    

    constructor(json) {
        super(json, PhotoTagsUpdate.schema);
      } catch(e) {
        throw new ErrorInternalAPIModelValidation(e.message);
      }
}

export class PhotoTagsDelete extends BaseModel{
    static schema ={
    tagName: { type: String, unique: true, required: true},
    color: { type: String, required: true},
    creatingUser: { type: Schema.Types.ObjectId, required: true},
    creationTime: { type: Date, required: true },
    modificationTime: { type: Date, required: true }}
    

    constructor(json) {
        super(json, PhotoTagsDelete.schema);
      } catch(e) {
        throw new ErrorInternalAPIModelValidation(e.message);
      }
}