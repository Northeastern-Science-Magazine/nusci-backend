import express from "express";
import cors from "cors";
import dotenv from "dotenv";
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

dotenv.config();

const app = express();

// Configure CORS to allow requests from localhost:3000 and any configured FRONTEND_URL
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, Postman, or cURL)
      if (!origin) return callback(null, true);

      // List of allowed origins
      const allowedOrigins = ["http://localhost:3000", "http://localhost:3001", process.env.FRONTEND_URL].filter(Boolean); // Remove undefined values

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    optionsSuccessStatus: 204,
  })
);

// Configure Helmet to not interfere with CORS
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginEmbedderPolicy: false,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/", defaultRouter);
app.use("/articles", articleRouter);
app.use("/issue-map", issueMapRouter);
app.use("/photo", photoRouter);
app.use("/phototag", photoTagRouter);
app.use("/user", userRouter);

export default app;
