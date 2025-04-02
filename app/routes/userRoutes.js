import express from "express";
import UserController from "../controllers/userController.js";
import Authorize from "../auth/authorization.js";
import Accounts from "../models/enums/accounts.js";

/* Controls Routing for Users */

const user = express.Router();

user.route("/login").post(UserController.login);
user.route("/signup").post(UserController.signup);
user.route("/filter");
user.route("/email/:email").get(UserController.getPublicUserByEmail);
user.route("/resolve-status").put(Authorize.allow([Accounts.Admin]), UserController.resolveUserApprovals);
user.route("/update/:email");
user.route("/me").get(Authorize.allow(Accounts.list()), UserController.getMyProfile);
user.route("/me/update");
user.route("/search").get(UserController.search);

export default user;
