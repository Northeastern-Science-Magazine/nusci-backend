import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";

/* This file may or may not be used */

let isLoggedIn = false; // Initialize the variable as false

const isLoggedInMiddleware = async (req, res, next) => {
  try {
    console.log("token: " + token);
    console.log("payload: " + payload);
    // check if auth header exists
    if (req.headers.authorization) {
      // parse token from header
      const token = req.headers.authorization.split(" ")[1]; //split the header and get the token
      if (token) {
        const payload = await jwt.verify(token, process.env.SECRET);
        console.log("token: " + token);
        console.log("payload: " + payload);
        if (payload) {
          // store user data in request object
          req.user = payload;
          isLoggedIn = true; // Set isLoggedIn to true if the token is verified
          next();
        } else {
          res.status(400).json({ error: "token verification failed" });
        }
      } else {
        res.status(400).json({ error: "malformed auth header" });
      }
    } else {
      res.status(400).json({ error: "No authorization header" });
    }
  } catch (error) {
    res.status(400).json({ error });
  }
};

export { isLoggedIn, isLoggedInMiddleware };