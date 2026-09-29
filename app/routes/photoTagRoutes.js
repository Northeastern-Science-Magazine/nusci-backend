import express from "express";
import PhotoTagController from "../controllers/photoTagController.js";
import Authorize from "../auth/authorization.js";
import Accounts from "../models/enums/accounts.js";

const photoTag = express.Router();

// photoTag.route("/create").post(Authorize.allow([Accounts.Admin, Accounts.Photographer]), PhotoTagController.create); //create a phototag
// photoTag.route("/name/:tagName").get(PhotoTagController.getTagByName); //get a tag by its name
// photoTag.route("/filter"); //get photo tags by colors, creating users
// photoTag.route("/update/:tagName"); //update a photo tag
// photoTag.route("/delete/:tagName"); //delete a photo tag

export default photoTag;
