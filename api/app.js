import express from "express";
import cors from "cors";
import helmet from "helmet";
import pagesRouter from "./routes/public.pages.route.js";
import articlesRouter from "./routes/articles.route.js";
import usersRouter from "./routes/users.route.js";
import internalRouter from "./routes/internal.pages.route.js";
import morgan from "morgan";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
//import articles from './routes/articles.route.js'

/**
 * This file controls the express server and
 * lets the server use everything it needs to
 * in order to function.
 */

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());

app.use("/", pagesRouter);
app.use("/internal", internalRouter);
app.use("/articles", articlesRouter);
app.use("/users", usersRouter);

export default app;
