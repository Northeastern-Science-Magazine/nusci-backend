import express from "express";

const photoTag = express.Router();

photoTag.route("/create"); //create a phototag
photoTag.route("/tag-name/:tagName"); //get a tag by its name
photoTag.route("/filter"); //get photo tags by colors, creating users
photoTag.route("/update/:tagName"); //update a photo tag
photoTag.route("/delete/:tagName"); //delete a photo tag

export default photoTag;
