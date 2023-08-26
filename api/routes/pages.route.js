import express from 'express'
import path from 'path'
import UserCTRL from '../controllers/users.controller.js';
import bodyParser from 'body-parser';
import authorizeToken from "../auth/authorization.js";

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
.post((req, res) => {
    UserCTRL.apiPostSignUp(req, res);
    errorHandling(res);
});

/*--------------NOTE----------------*/
/**
 * We need to figure out a way to separate this functionality (below) so that
 * this file is clean. Right now this file handles things that are not exclusively
 * routing information.
 */

/* Login Page Router */
router.route('/login')
.get((req, res) => {
    if(req.cookies.token) {
        res.redirect('/profile');
    } else {
        res.sendFile(path.resolve() + '/public/html/login.html');
    }
})
.post(UserCTRL.apiPostLogin, errorHandling);


/* Error Page Router */
router.route('/error').get((req, res) => {
    let errorMsg = req.cookies.errorMsg;
    res.render("error_page", {statusCode : "testcode", 
        error: errorMsg});
})

/* redirects to error page if error occurs */
function errorHandling(req, res) {
    if (true) {
        res.cookie("errorMsg", "Asdf");
        res.redirect("/error");
    }
}

/* Logout Router */
router.route('/logout').get((req, res) => {
    res.clearCookie('token');
    res.redirect('/');
    console.log("Signed out");
});

/* Profile Router */
router.route('/profile').get(authorizeToken, (req, res) => {
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

export default router