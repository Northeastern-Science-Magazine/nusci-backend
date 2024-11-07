import express from "express";
import Connection from "../db/connection.js";
import { ErrorDatabaseConnection } from "../error/errors.js";

const router = express.Router();

router.route("/").get((req, res) => {
  res.status(200).json({ message: "Successfully connected to the NU Sci API!" });
});

router.route("/db").get(async (req, res) => {
  try {
    await Connection.open(true);
    await Connection.close(true);
    res.status(200).json({ message: "Successfully connected to the NU Sci Database Instance!" });
  } catch (e) {
    console.log(e);
    new ErrorDatabaseConnection().throwHttp(req, res);
  }
});

export default router;
