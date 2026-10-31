import express from "express";
import Authorize from "../auth/authorization.js";
import Accounts from "../models/enums/accounts.js";
import MediaController from "../controllers/mediaController.js";

/* Controls Routing for S3 media */

const media = express.Router();

// each folder decides which of these roles can upload to it
const SIGNED_IN = Accounts.list().filter((account) => account !== Accounts.None);

media.route("/upload-url").post(Authorize.allow(SIGNED_IN), MediaController.createUploadUrl); //presigned upload URL
media.route("/download-url").get(MediaController.getDownloadUrl); //presigned download URL for an image

export default media;
