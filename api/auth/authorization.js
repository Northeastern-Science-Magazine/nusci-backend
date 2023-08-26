import dotenv from "dotenv";
import jwt from "jsonwebtoken";

/**
 * authorizeToken Method
 * 
 * If the user is logged in, this method will call the next
 * http method in line. If not, this method will redirect the
 * user to be logged in.
 * 
 * @param {*} req http request
 * @param {*} res http response
 * @param {*} next http method
 */
const authorizeToken = async (req, res, next) => {
    dotenv.config();
    if(req.cookies.token) {
        const payload = await jwt.verify(req.cookies.token, process.env.TOKEN_KEY);
        if(payload) {
            req.user = payload;
            next();
        } else {
            res.error = 4012;
            next();
        }
    } else {
        req.error = 4011;
        next();
    }
}

export default authorizeToken;