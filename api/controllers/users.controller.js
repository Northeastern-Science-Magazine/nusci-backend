dotenvConfig(); // load .env variables
import { config as dotenvConfig } from "dotenv";
import UsersAccessor from "../database_accessor/users.accessor.js";
import bcrypt from "bcryptjs"; // import bcrypt to hash passwords
import jwt from "jsonwebtoken"; // import jwt to sign tokens

//DESTRUCTURE ENV VARIABLES WITH DEFAULTS
const { SECRET = "secret" } = process.env;

export default class UsersCTRL {
    static async apiPostLogin(req, res) {
        try {
            // check if the user exists
            const user = await UsersAccessor.getUserByUsername(
                req.body.username
            );
            if (user) {
                //check if password matches
                const result = await bcrypt.compare(
                    req.body.password,
                    user.password
                );
                if (result) {
                    // sign token and send it in response
                    const token = await jwt.sign(
                        { username: user.username },
                        SECRET
                    );
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
    }

    static async apiPostSignUp(req, res) {
        try {
            console.log("Sign up username: " + req.body.username);
            console.log("Sign up password: " + req.body.password);
            // hash the password
            req.body.password = await bcrypt.hash(req.body.password, 10);
            // create a new user in database
            const user = await UsersAccessor.createUser(req.body);
            // send new user as response
            res.json(user);
        } catch (error) {
            res.status(400).json({ error });
        }
    }
}
