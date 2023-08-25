import express from "express";
import cors from "cors";
import helmet from "helmet";
import pagesRouter from "./routes/pages.route.js";
import articlesRouter from "./routes/articles.route.js";
import morgan from "morgan";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
//import articles from './routes/articles.route.js'
import authenticate from "./auth/login_verification.js";
import http from 'http';

/**
 * This file controls the express server and
 * lets the server use everything it needs to
 * in order to function. 
 */

const app = express();

app.set("view engine", "ejs");

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(morgan("tiny"));
app.use(cookieParser())
app.use(bodyParser.json());
app.use("/public", express.static(process.cwd() + "/public"));

app.use("/", pagesRouter);

app.use("/articles", articlesRouter);

app.get('/logout', (req,res) => {
    const authHeaders = req.cookies;
    console.log(authHeaders);
    res.json({authHeaders});
    //res.redirect('/');
});

app.get("/profile", (req, res) => {
    //if auth cookie exists, set it to the auth header
    //if not, redirect to home page
    
    req.headers['Authorization'] = "Bearer 123";
    console.log(req.headers.Authorization);

    res.render('profile', {loggedIn: "yes"});
});

export default app;
