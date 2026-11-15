import express from "express";
import Authorize from "../auth/authorization.js";
import Accounts from "../models/enums/accounts.js";
import PitchController from "../controllers/pitchController.js";

const pitch = express.Router();

pitch.route("/").post(PitchController.submitPitch);

pitch
  .route("/settings")
  .get(Authorize.allow([Accounts.Admin]), PitchController.getSettings)
  .patch(Authorize.allow([Accounts.Admin]), PitchController.updateSettings);

export default pitch;