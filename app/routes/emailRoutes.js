import express from "express";
import EmailController from "../controllers/emailController.js";
import Authorize from "../auth/authorization.js";
import Accounts from "../models/enums/accounts.js";

const email = express.Router();

email.route("/send").post(Authorize.allow([Accounts.Admin]), EmailController.sendEmail);
email.route("/reset-password").post(Authorize.allow([Accounts.Admin]), EmailController.resetPassword);

export default email;
