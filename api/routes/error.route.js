/**
 * catchError method
 * 
 * This method finalizes any responses to errors that
 * may happen on the site. Pages that display errors, like
 * the error page, login, or signup page should check for 
 * an error cookie, and display it if exists (EJS). Such
 * cookies should expire soon after display. If the error
 * page is refreshed, it should redirect to the home page.
 * 
 * Make sure the right error is thrown in response.
 * 
 * Custom Error Codes:
 * 
 * -- Types of 400 Errors --
 * - 4000 - Bad Request
 * - 4001 - Login attempt to user that does not exist
 * - 4002 - Login attempt with invalid password
 * - 4003 - Login attempt when logged in
 * 
 * -- Types of 401 Errors --
 * - 4010 - Unauthorized
 * - 4011 - User requested a page they must be signed in to access
 * - 4012 - User requested a higher level page with tampered token
 * 
 * - 4040 - User requested a page that doesn't exist
 * 
 * @param {*} req http request
 * @param {*} res http response
 */
const catchError = (req, res, next) => {
    res.clearCookie("error");
    if(req.error) {
        switch(req.error) {
            case 4000:
                res.cookie("error", "Bad Request", {maxAge: 1000});
                res.redirect("/error");
                break;
            case 4001:
                res.cookie("error", "Invalid Username", {maxAge: 1000});
                res.redirect("/login");
                break;
            case 4002:
                res.cookie("error", "Invalid Password", {maxAge: 1000});
                res.redirect("/login");
                break;
            case 4003:
                res.redirect("/profile");
            case 4010:
                res.cookie("error", "Unauthorized", {maxAge: 1000});
                res.redirect("/error");
                break;
            case 4011:
                res.cookie("error", "Please log in to access that page.", {maxAge: 1000});
                res.redirect("/login");
                break;
            case 4012:
                res.cookie("error", "Bad Token", {maxAge: 1000});
                res.redirect('/error');
                break;
            case 4040:
                res.cookie("error", "Page Not Found", {maxAge: 1000});
                res.redirect("/error");
                break;
            default:
                res.redirect("/");
                break;
        }
    } else {
        //if no errors, move on.
        next();
    }
}

export default catchError;