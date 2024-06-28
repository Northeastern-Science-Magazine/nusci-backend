import express from "express";
import bodyParser from "body-parser";
import UserController from "../controllers/userController.js";
import Authorize from "../auth/authorization.js";
import Accounts from "../models/enums/accounts.js";

/* Controls Routing for Users */

const router = express.Router();

router.use(bodyParser.urlencoded({ extended: false }));

router.route("/login");
router.route("/signup");
router.route("/profile/:username").get(UserController.getPublicProfile);

router.route("/profile/me").get(Authorize.allow(Accounts.list()), UserController.getMyProfile);

export default router;
