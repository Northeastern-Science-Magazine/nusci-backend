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

router.route('/public/css/main.css').get((req, res) => {
    res.sendFile(path.resolve() + 'public/css/main.css')
})

router.route('/public/css/themes/:themeName.css').get((req, res) => {
    res.sendFile(path.resolve() + 'public/css/themes/' + req.params.themeName + '.css');
})

export default router