import express from "express";
import PhotoController from "../controllers/photoController.js";
import Authorize from "../auth/authorization.js";
import Accounts from "../models/enums/accounts.js";

const photo = express.Router();

photo.route("/upload"); //upload a photo

photo.route("/upload/url").post(Authorize.allow([Accounts.Admin, Accounts.Photographer]), PhotoController.addPhotoByURL); // upload a photo by URL

photo.route("/upload/file").post(Authorize.allow([Accounts.Admin, Accounts.Photographer]), PhotoController.addPhotoByFile); //upload a photo by file

photo.route("/add-tag/:url"); //add a tag to this photo (maybe do it by id?)
photo.route("/filter"); //filter by tags, photographer etc
photo.route("/:url"); //get a photo by its url

photo.route("/photographers/:url"); //update the list of photographers for the photo

export default photo;
