import express from "express";
import Authorize from "../auth/authorization.js";
import Accounts from "../models/enums/accounts.js";
import MediaController from "../controllers/mediaController.js";

/* Controls Routing for S3 media */

const media = express.Router();

media.route("/upload-url").post(Authorize.allow([Accounts.Admin, Accounts.Editor]), MediaController.createUploadUrl); //presigned upload URL

export default media;
