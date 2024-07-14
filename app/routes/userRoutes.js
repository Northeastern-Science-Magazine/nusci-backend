import express from "express";
import bodyParser from "body-parser";
import UserController from "../controllers/userController.js";
import Authorize from "../auth/authorization.js";
import Accounts from "../models/enums/accounts.js";

/* Controls Routing for Users */

const router = express.Router();

router.use(bodyParser.urlencoded({ extended: false }));

router.route("/login").post(UserController.login); //log in
router.route("/signup").post(UserController.signup); //sign up

router.route("/filter"); //get users by options: graduation years, statuses, roles
router.route("/username/:username").get(UserController.getPublicUserByUsername); //get a single user by username

router.route("/resolve-status").put(Authorize.allow(Accounts.Admin), UserController.resolveUserApprovals); //approve/deny a given list of users, admin only
router.route("/update/:username"); //admin update of a user including adding + removing roles

router.route("/me").get(Authorize.allow(Accounts.list()), UserController.getMyProfile);
router.route("/me/update"); //update the currently signed in account

export default router;
