import express from "express";
import path from "path";
import UserController from "../controllers/users.controller.js";
import bodyParser from "body-parser";

/**
 * This file controls all routes on the main, public
 * facing side of the website. (i.e. pages and routes
 * that not need login in to access)
 */

const router = express.Router();

router.use(bodyParser.urlencoded({ extended: false }));

/* Default Page Router */
router.route("/").get((req, res) => {
  res.sendFile(path.resolve() + "/public/html/index.html");
});

/* Authors HTML Router */
router.route("/authors").get((req, res) => {
  res.sendFile(path.resolve() + "/public/html/authors.html");
});

/* Eboard Page Router */
router.route("/eboard").get((req, res) => {
  res.sendFile(path.resolve() + "/public/html/eboard20232024.html");
});

/* Contact Page Router */
router.route("/contact").get((req, res) => {
  res.sendFile(path.resolve() + "/public/html/contact.html")
});

/* Main CSS Router */
router.route("/public/css/:style.css").get((req, res) => {
  res.sendFile(path.resolve() + `public/css/${req.params.style}.css`);
});

/* CSS Themes Router */
router.route("/public/css/themes/:themeName.css").get((req, res) => {
  res.sendFile(path.resolve() + `public/css/themes/${req.params.themeName}.css`);
});

/* Sign Up Page Router */
router
  .route("/signup")
  .get((req, res) => {
    res.sendFile(path.resolve() + "/public/html/signup.html");
  })
  .post(UserController.apiPostSignUp);

/* About Us Router */
router.route("/about-us").get((req, res) => {
  res.sendFile(path.resolve() + "/public/html/about_us.html");
});

export default router;
