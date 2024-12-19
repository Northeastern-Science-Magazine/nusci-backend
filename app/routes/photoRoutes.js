import express from "express";

const photo = express.Router();

photo.route("/upload"); //upload a photo

photo.route("/add-tag/:url"); //add a tag to this photo (maybe do it by id?)
photo.route("/filter"); //filter by tags, photographer etc
photo.route("/:url"); //get a photo by its url

photo.route("/photographers/:url"); //update the list of photographers for the photo

export default photo;
