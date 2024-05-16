import express from "express";
import UsersCTRL from "../controllers/users.controller.js";

/* Controls Routing for Users */

const router = express.Router();

router.route("/profile/:username").get(UsersCTRL.getPublicProfile);

export default router;
