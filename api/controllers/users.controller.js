dotenvConfig(); // load .env variables
import { config as dotenvConfig } from "dotenv";
import UsersAccessor from "../database_accessor/users.accessor.js";
import bcrypt from "bcryptjs"; // import bcrypt to hash passwords
import jwt from "jsonwebtoken"; // import jwt to sign tokens

/**
 * UsersCTRL Class
 * 
 * This class controls the behaviour of any web request
 * related to Users.
 */
export default class UsersCTRL {
    /**
     * apiPostLogin Method
     * 
     * This method checks whether or not the request
     * to sign in is valid. Utilizes the getRegisteredByUsername
     * UserAccessor method to accomplish this.
     * 
     * @param {*} req web request object
     * @param {*} res web response
     */
    static async apiPostLogin(req, res, next) {
        try {
            if(!req.cookies.token) {
                // check if the user is registered
                const user = await UsersAccessor.getRegisteredByUsername(
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
                        const token = jwt.sign(
                            {
                                username: user.username,
                                role: user.role,
                                information: user.information
                            },
                            process.env.TOKEN_KEY
                        );

                        //Users are logged in for 1 hour
                        res.cookie('token', token, {httpOnly: true, maxAge: 60 * 60 * 1000});
                        res.redirect('/profile');
                    } else {
                        req.error = 4002;
                        return next();
                    }
                } else {
                    //check if the user is unregistered                 
                    const unregistered = await UsersAccessor.getUnregisteredByUsername(req.body.username);
                    if(unregistered) {
                        req.error = 4005;
                        return next();
                    } else {
                        //doesn't exist
                        req.error = 4001;
                        return next();
                    }
                }
            } else {
                req.error = 4003;
                return next();
            }
        } catch (error) {
            req.error = 4000;
            return next();
        }
    }

    /**
     * apiPostSignUp Method
     * 
     * This method adds a new user to the unregistered user
     * collection in the user database. It accomplishes this
     * by calling the user.accessor.js file and creating a new
     * user with the existing req data.
     * 
     * @param {*} req web request information for signup
     * @param {*} res weh response object
     */
    static async apiPostSignUp(req, res, next) {
        try {
            // hash the password
            req.body.password = await bcrypt.hash(req.body.password, 10);
            
            // make sure nested data is structured properly
            req.body.information = {
                year: req.body.year,
                major: req.body.major,
                bio: req.body.bio,
                image: req.body.image,
            }

            const registered = await UsersAccessor.getRegisteredByUsername(req.body.username);
            const unregistered = await UsersAccessor.getUnregisteredByUsername(req.body.username);
            
            if(!registered && !unregistered) {
                await UsersAccessor.createUser(req.body);
                res.redirect('/login');
            } else {
                req.error = 4004;
                next();
            }  
        } catch (error) {
            req.error = 4000;
            return next();
        }
    }
}
