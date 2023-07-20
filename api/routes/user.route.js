import { config as dotenvConfig } from 'dotenv';

dotenvConfig(); // load .env variables

import Router from "express"; // import router from express
import User from "../models/user.js"; // import user model
import bcrypt from "bcryptjs"; // import bcrypt to hash passwords
import jwt from "jsonwebtoken"; // import jwt to sign tokens

const router = Router(); // create router to create route bundle

//DESTRUCTURE ENV VARIABLES WITH DEFAULTS
const { SECRET = "secret" } = process.env;

// Signup route to create a new user
router.post("/signup-request", async (req, res) => {
  try {
    console.log("Sign up username: " + req.body.username);
    console.log("Sign up password: " + req.body.password);
    // hash the password
    //req.body.password = "hello";
    req.body.password = await bcrypt.hash(req.body.password, 10);
    // create a new user
    const user = await User.create(req.body);
    // send new user as response
    res.json(user);
  } catch (error){
    console.log(error);
    res.status(400).json({ error });
  }
});

// Login route to verify a user and get a token
router.post("/login-request", async (req, res) => {
  try {
    // check if the user exists
    const user = await User.findOne({ username: req.body.username });
    if (user) {
      //check if password matches
      const result = await bcrypt.compare(req.body.password, user.password);
      if (result) {
        // sign token and send it in response
        const token = await jwt.sign({ username: user.username }, SECRET);
        res.json({ token });
      } else {
        res.status(400).json({ error: "password doesn't match" });
      }
    } else {
      res.status(400).json({ error: "User doesn't exist" });
    }
  } catch (error) {
    res.status(400).json({ error });
  }
});

const UserRouter = router; // create router to create route bundle;

export default UserRouter; // export router