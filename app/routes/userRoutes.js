import express from "express";
import UserController from "../controllers/userController.js";
import Authorize from "../auth/authorization.js";
import Accounts from "../models/enums/accounts.js";

/* Controls Routing for Users */

const user = express.Router();

user.route("/login").post(UserController.login); //log in
user.route("/signup").post(UserController.signup); //sign up

user.route("/filter"); //get users by options: graduation years, statuses, roles
user.route("/email/:email").get(UserController.getPublicUserByEmail); //get a single user by email

user.route("/resolve-status").put(Authorize.allow([Accounts.Admin]), UserController.resolveUserApprovals); //approve/deny a given list of users, admin only
user.route("/update/:email"); //admin update of a user including adding + removing roles

user.route("/me").get(Authorize.allow(Accounts.list()), UserController.getMyProfile);
user.route("/me/update"); //update the currently signed in account

export default user;
