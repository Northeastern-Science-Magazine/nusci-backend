import express from "express";
import cors from "cors";
import helmet from "helmet";
import pagesRouter from "./routes/pages.route.js";
import articlesRouter from "./routes/articles.route.js";
import morgan from "morgan";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
//import articles from './routes/articles.route.js'
import authorizeToken from "./auth/authorization.js";

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

app.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/');
    console.log("Signed out");
});

app.get("/profile", authorizeToken, (req, res) => {
    //console.log(req.user);
    const user = req.user;
    res.render('profile',
    {
        name: user.username,
        role: user.role,
        year: user.information.year,
        major: user.information.major,
        bio: user.information.bio,
    }
);
});

export default app;
