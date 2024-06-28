import express from "express";
import bodyParser from "body-parser";

const router = express.Router();

router.use(bodyParser.urlencoded({ extended: false }));

router.route("/").get((req, res) => {
  res.status(200).json({ message: "Successfully connected to the nu-sci api!" });
});

export default router;
