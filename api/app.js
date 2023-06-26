import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import pages from './routes/pages.route.js'
import path from 'path'
import morgan from 'morgan'
import UserRouter from './controllers/User.js'
import dotenv from 'dotenv'
dotenv.config();
import log from 'mercedlogger';
import TodoRouter from './controllers/Todo.js'

//DESTRUCTURE ENV VARIABLES WITH DEFAULT VALUES
const {PORT = 3000} = process.env

//import articles from './routes/articles.route.js'

const app = express()

app.use(cors())
app.use(helmet())
app.use(express.json())

app.use('/public', express.static(process.cwd() + '/public'));

app.use('/', pages)
app.use('/eboard', pages)
app.use('/authors', pages)
app.use(morgan("tiny")) // log the request for debugging
app.use(express.json()) // parse json bodies
//app.use('/public/css/homepage.css', pages)

//app route
// ROUTES AND ROUTES
app.use("/user", UserRouter) // send all "/user" requests to UserRouter for routing
app.use("/todos", TodoRouter) // send all "/todos" request to TodoROuter



export default app;