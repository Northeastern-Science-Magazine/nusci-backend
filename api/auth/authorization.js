import dotenv from "dotenv";
import jwt from "jsonwebtoken";

/**
 * Authorize Class
 * 
 * This class authorizes requests to pages with restrictions.
 * The lowest to highest authorization is as follows:
 * 1. Author
 * 2. Editor
 * 3. Developer
 * 4. Admin
 * Each subsequent level can access everything the previous level can access. 
 */
export default class Authorize {
    /**
     * token Method
     * 
     * If the user is logged in, this method will call the next
     * http method in line. If not, this method will redirect the
     * user to be logged in.
     * 
     * @param {*} req http request
     * @param {*} res http response
     * @param {*} next http method
     * @param {*} role role to be authorized
     */
    static token(req, res, next, role) {
        dotenv.config();
        if(req.cookies.token) {
            const payload = jwt.verify(req.cookies.token, process.env.TOKEN_KEY);
            if(payload) {
                const userPermissionLevel = Authorize.roleToLevel(payload.role);
                const requestedPermissionLevel = Authorize.roleToLevel(role);
                
                if(userPermissionLevel >= requestedPermissionLevel) {
                    req.user = payload;
                    next();
                } else {
                    req.error = 4012;
                    next();
                }
            } else {
                req.error = 4013;
                next();
            }
        } else {
            req.error = 4011;
            next();
        }
    }

    /**
     * roleToLevel Method
     * 
     * This method takes in a user role, and returns its level.
     * 
     * @param {*} role 
     * @returns integer - level associated with the role
     */
    static roleToLevel(role) {
        switch(role) {
            case "Author": return 1;
            case "Editor": return 2;
            case "Developer": return 3;
            case "Admin": return 4;
            default: return 0;
        }
    }

    /**
     * author Method
     * 
     * Authorizes permission for Author level accounts or higher.
     * 
     * @param {*} req http request
     * @param {*} res http response
     * @param {*} next next http middleware method
     */
    static author(req, res, next) {
        return Authorize.token(req, res, next, "Author");
    }

    /**
     * editor Method
     * 
     * Authorizes permission for Editor level accounts or higher.
     * 
     * @param {*} req http request
     * @param {*} res http response
     * @param {*} next next http middleware method
     */
    static editor(req, res, next) {
        return Authorize.token(req, res, next, "Editor");
    }

    /**
     * developer Method
     * 
     * Authorizes permission for Developer level accounts or higher.
     * 
     * @param {*} req http request
     * @param {*} res http response
     * @param {*} next next http middleware method
     */
    static developer(req, res, next) {
        return Authorize.token(req, res, next, "Developer");
    }

    /**
     * admin Method
     * 
     * Authorizes permission for Admin level accounts.
     * 
     * @param {*} req http request
     * @param {*} res http response
     * @param {*} next next http middleware method
     */
    static admin(req, res, next) {
        return Authorize.token(req, res, next, "Admin");
    }
}