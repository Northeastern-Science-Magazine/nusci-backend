import express from 'express'
import path from 'path'
import authenticate from "../auth/login_verification.js";
import UserCTRL from '../controllers/users.controller.js';
import bodyParser from 'body-parser';

const router = express.Router();

router.use(bodyParser.urlencoded({ extended: false }));

/**
 * This file controls the routing for the static
 * pages on the NU SCI Website. This includes all
 * hardcoded pages not served from the database.
 */

/* Default Page Router */
router.route('/').get((req, res) => {
    res.sendFile(path.resolve() + '/public/html/index.html');
})

/* Authors HTML Router */
router.route('/authors').get((req, res) => {
    console.log(isLoggedIn);
    res.sendFile(path.resolve() + '/public/html/authors.html');
})

/* Eboard Page Router */
router.route('/eboard').get((req, res) => {
    res.sendFile(path.resolve() + '/public/html/eboard.html');
})

/* Main CSS Router */
router.route('/public/css/main.css').get((req, res) => {
    res.sendFile(path.resolve() + 'public/css/main.css')
})

/* CSS Themes Router */
router.route('/public/css/themes/:themeName.css').get((req, res) => {
    res.sendFile(path.resolve() + `public/css/themes/${req.params.themeName}.css`);
})

/* Sign Up Page Router */
router.route('/signup')
.get((req, res) => {
    res.sendFile(path.resolve() + '/public/html/signup.html');
})
.post(UserCTRL.apiPostSignUp);

/* Login Page Router */
router.route('/login')
.get((req, res) => {
  res.sendFile(path.resolve() + '/public/html/login.html');
})
.post(UserCTRL.apiPostLogin);

export default router