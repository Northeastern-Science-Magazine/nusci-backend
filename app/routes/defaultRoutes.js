import express from "express";
import bodyParser from "body-parser";
import Connection from "../db/connection";
import { ErrorDatabaseConnection } from "../error/httpErrors";

const router = express.Router();

router.use(bodyParser.urlencoded({ extended: false }));

router.route("/").get((req, res) => {
  res.status(200).json({ message: "Successfully connected to the NU Sci API!" });
});

router.route("/db").get(async (req, res) => {
  try {
    await Connection.open();
    await Connection.close();
    res.status(200).json({ message: "Successfully connected to the NU Sci Database Instance!" });
  } catch (e) {
    console.log(e);
    ErrorDatabaseConnection.throwHttp(req, res);
  }
});

export default router;
