import express from "express";
import bodyParser from "body-parser";

const router = express.Router();

router.use(bodyParser.urlencoded({ extended: false }));

router.route("/create"); //create an issue map

export default router;
