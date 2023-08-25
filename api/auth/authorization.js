import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";

const authorizeToken = async (req, res, next) => {
    if(req.cookies.token) {
        const payload = await jwt.verify(req.cookies.token, process.env.TOKEN_KEY);
        if(payload) {
            req.user = payload;
            next();
        } else {
            res.json({Message: "Bad token"});
        }
    } else {
        res.json({Message: "Not Logged in"});
    }
}

export default authorizeToken;