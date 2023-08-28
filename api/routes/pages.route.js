import express from 'express'
import path from 'path'
import UserCTRL from '../controllers/users.controller.js';
import bodyParser from 'body-parser';
import Authorize from "../auth/authorization.js";
import catchError from '../routes/error.route.js';
import RoutesController from "../controllers/routes.controller.js";


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
.post(UserCTRL.apiPostSignUp, catchError);

/* Login Page Router */
router.route('/login')
.get(RoutesController.getLogin)
.post(UserCTRL.apiPostLogin, catchError);

/* Error Page Router */
router.route('/error').get(RoutesController.getError);

/* Logout Router */
router.route('/logout').get(RoutesController.getLogout);

/* Profile Router */
router.route('/profile').get(authorizeToken, catchError, (req, res) => {
    const user = req.user;
    res.render('profile',
    {
        name: user.username,
        role: user.role,
        year: user.information.year,
        major: user.information.major,
        bio: user.information.bio,
    });
});

router.route('/*').get((req, res, next) => {
    req.error = 4040;
    next();
}, catchError);

export default router