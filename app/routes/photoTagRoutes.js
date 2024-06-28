import express from "express";
import bodyParser from "body-parser";

const router = express.Router();

router.use(bodyParser.urlencoded({ extended: false }));

router.route("/create"); //create a phototag
router.route("/tag-name/:tagName"); //get a tag by its name
router.route("/filter"); //get photo tags by colors, creating users
router.route("/update/:tagName"); //update a photo tag
router.route("/delete/:tagName"); //delete a photo tag

export default router;
