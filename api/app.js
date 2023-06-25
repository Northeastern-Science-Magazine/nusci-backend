import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import pages from './routes/pages.route.js'
import path from 'path'
//import articles from './routes/articles.route.js'

const app = express()

app.use(cors())
app.use(helmet())
app.use(express.json())

app.use('/public', express.static(process.cwd() + '/public'));

app.use('/', pages)
app.use('/eboard', pages)
app.use('/authors', pages)
//app.use('/public/css/homepage.css', pages)



export default app;