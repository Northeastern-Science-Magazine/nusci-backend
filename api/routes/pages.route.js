/* Controls Routing for Main Pages of the Website */
/*
- Home Page
 - All Articles???
 - Authors?????
 - Eboard
 - Editors?????
 - Contact
 - About Us
*/

import express from 'express'
import path from 'path'

const router = express.Router();

router.route('/').get((req, res) => {
    res.sendFile(path.resolve() + '/public/index.html');
})

router.route('/authors').get((req, res) => {
    res.sendFile(path.resolve() + '/public/authors.html');
})

router.route('/eboard').get((req, res) => {
    res.sendFile(path.resolve() + '/public/eboard.html');
})

router.route('/public/css/homepage.css').get((req, res) => {
    res.sendFile(path.resolve() + 'public/css/homepage.css')
})

router.route('/secrets').get(isAuth, (req, res) => {
    const secrets = [
        {
            id: 1,
            name: "Secret 1",
        },
        {
            id: 2,
            name: "Secret",
        }
    ];
  
    res.json(secrets);
});

function isAuth(req, res, next) {
    const auth = req.headers.authorization;
    if (auth === 'password') {
      next();
    } else {
      res.status(401);
      res.send('Access forbidden');
    }
}

export default router