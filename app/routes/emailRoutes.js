import express from "express";
import EmailService from "../services/emailService";
import Authorize from "../auth/authorization";
import Accounts from "../models/enums/accounts";

/* Email service routing */
const email = express.Router();

email.route("/send")
.post(Authorize.allow([Accounts.Admin]), EmailService.sendEmail);

export default email;
