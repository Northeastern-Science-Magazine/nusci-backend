import Error from "./errors.js";

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
 */
const handleError = (res, error) => {
  res.clearCookie("error");
  switch (error) {
    case Error[400].BadRequest:
      res.cookie("error", "Bad Request", { maxAge: 1000 });
      res.redirect("/error");
      break;
    case Error[400].Login.LoggedIn:
      res.cookie("error", "Already logged in", { maxAge: 1000 });
      res.redirect("/profile");
      break;
    case Error[400].Login.Username:
      res.cookie("error", "User does not exist", { maxAge: 1000 });
      res.redirect("/login");
      break;
    case Error[400].Login.Password:
      res.cookie("error", "Incorrect password", { maxAge: 1000 });
      res.redirect("/login");
      break;
    case Error[400].SignUp.Username:
      res.cookie("error", "Username already exists", { maxAge: 1000 });
      res.redirect("/signup");
      break;
    case Error[400].SignUp.Email:
      res.cookie("error", "Email already registered", { maxAge: 1000 });
      res.redirect("/signup");
      break;
    case Error[400].Unregistered:
      res.cookie("error", "You currently have an unregistered account. Ask an Admin to approve your registration.", {
        maxAge: 1000,
      });
      res.redirect("/login");
      break;
    case Error[401].Unauthorized:
      res.cookie("error", "Please log in to access that page.", { maxAge: 1000 });
      res.redirect("/login");
      break;
    case Error[403].Forbidden:
      res.cookie("error", "You do not have permission to access this page.", { maxAge: 1000 });
      res.redirect("/error");
      break;
    case Error[404].NotFound:
      res.cookie("error", "Page Not Found", { maxAge: 1000 });
      res.redirect("/error");
      break;
    case Error[418].Teapot:
      res.cookie("error", "Attempted to brew coffee with a teapot", { maxAge: 1000 });
      res.redirect("/error");
      break;
    case Error[500].InternalServerError:
      res.cookie("error", "Internal server error", { maxAge: 1000 });
      res.redirect("/error");
      break;
    case Error[500].DataRetrieval:
      res.cookie("error", "Internal server error", { maxAge: 1000 });
      res.redirect("/error");
      break;
    case Error[500].DataEntry:
      res.cookie("error", "Internal server error", { maxAge: 1000 });
      res.redirect("/error");
      break;
    default:
      res.redirect("/");
      break;
  }
};

export default handleError;
