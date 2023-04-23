/* Controls Routing for Finished Articles */

/*
This will require special implementation because
each article needs to be standardized so that
we can read it straight off the database and not have to control
the entire thing from the file routing system. 

*/

import express from 'express'
import ArticlesCTRL from './controllers/articles.controller.js'

const router = express.Router();

//any valid ID of an article should work... ID or NAME perhaps
router.route('/articles/:id').get(ArticlesCTRL.apiGetArticles)

//export default router