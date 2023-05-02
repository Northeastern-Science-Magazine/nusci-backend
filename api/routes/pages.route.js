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
    res.sendFile(path.resolve() + '/src/static/homepage/index.html');
})

router.route('/authors').get((req, res) => {
    res.sendFile(path.resolve() + '/src/static/authors/authors.html');
})

router.route('/eboard').get((req, res) => {
    res.sendFile(path.resolve() + '/src/static/eboard/eboard.html');
})

export default router