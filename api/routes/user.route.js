// import { config as dotenvConfig } from 'dotenv';

// dotenvConfig(); // load .env variables
// import express from 'express';
// import User from "../models/user.js"; // import user model
// import bcrypt from "bcryptjs"; // import bcrypt to hash passwords
// import jwt from "jsonwebtoken"; // import jwt to sign tokens
// import bodyParser from "body-parser"; //parser to process requests

// const router = express.Router(); // create router to create route bundle
// router.use(bodyParser.urlencoded({ extended: false }));

// //DESTRUCTURE ENV VARIABLES WITH DEFAULTS
// const { SECRET = "secret" } = process.env;

// /* Sign Up Page Router */
// router.route('/signup')
// .get((req, res) => {
//     res.sendFile(path.resolve() + '/public/html/signup.html');
// })
// .post(async (req, res) => {
//   try {
//     console.log("Sign up username: " + req.body.username);
//     console.log("Sign up password: " + req.body.password);
//     // hash the password
//     req.body.password = await bcrypt.hash(req.body.password, 10);
//     // create a new user in database
//     const user = await User.create(req.body);
//     // send new user as response
//     res.json(user);
//   } catch (error){
//     console.log(error);
//     res.status(400).json({ error });
//   }
// });

// /* Login Page Router */
// router.route('/login')
// .get((req, res) => {
//   res.sendFile(path.resolve() + '/public/html/login.html');
// })
// .post(async (req, res) => {
//   try {
//     // check if the user exists
//     const user = await User.findOne({ username: req.body.username });
//     if (user) {
//       //check if password matches
//       const result = await bcrypt.compare(req.body.password, user.password);
//       if (result) {
//         // sign token and send it in response
//         const token = await jwt.sign({ username: user.username }, SECRET);
//         res.json({ token });
//       } else {
//         res.status(400).json({ error: "password doesn't match" });
//       }
//     } else {
//       res.status(400).json({ error: "User doesn't exist" });
//     }
//   } catch (error) {
//     res.status(400).json({ error });
//   }
// });

// const UserRouter = router; // create router to create route bundle;

// export default UserRouter; // export router