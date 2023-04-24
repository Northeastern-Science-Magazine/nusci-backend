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
    res.sendFile(path.resolve() + '/src/pages/homepage/index.html');
})

router.route('/authors').get((req, res) => {
    res.sendFile(path.resolve() + '/src/pages/authors/authors.html');
})

router.route('/articles').get((req, res) => {
    res.sendFile(path.resolve() + '/src/pages/articles/articles.html');
})

router.route('/eboard').get((req, res) => {
    res.sendFile(path.resolve() + '/src/pages/eboard/eboard.html');
})

export default router