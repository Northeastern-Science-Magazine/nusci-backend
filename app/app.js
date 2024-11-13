import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import articleRouter from "./routes/articleRoutes.js";
import defaultRouter from "./routes/defaultRoutes.js";
import issueMapRouter from "./routes/issueMapRoutes.js";
import photoRouter from "./routes/photoRoutes.js";
import photoTagRouter from "./routes/photoTagRoutes.js";
import userRouter from "./routes/userRoutes.js";

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

app.use("/", defaultRouter);
app.use("/articles", articleRouter);
app.use("/issue-map", issueMapRouter);
app.use("/photo", photoRouter);
app.use("/photo-tag", photoTagRouter);
app.use("/user", userRouter);

export default app;
