import express from "express";
import Authorize from "../auth/authorization.js";
import Accounts from "../models/enums/accounts.js";
import EmailController from "../controllers/emailController.js";

/* Email service routing */
const email = express.Router();

email.route("/send").post(EmailController.sendEmail);

export default email;
