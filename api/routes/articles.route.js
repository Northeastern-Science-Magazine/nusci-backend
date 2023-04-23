/* Controls Routing for Finished Articles */

/*
This will require special implementation because
each article needs to be standardized so that
we can read it straight off the database and not have to control
the entire thing from the file routing system. 

*/

import express from 'express'
import ArticlesCTRL from './controllers/articles.controller.js'
import path from 'path'

const router = express.Router();

router.route('/articles/:id').get(ArticlesCTRL.apiGetArticles)

//export default router