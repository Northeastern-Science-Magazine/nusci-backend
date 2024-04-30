/**
 * Error Object
 *
 * Custom Made error object to give more
 * specific control over errors being thrown.
 * Extensible on purpose - if you need to throw
 * an error for a case not covered, please add it.
 *
 * To add a new error, you have to add it here,
 * and you have to add a case in error.handler.js
 * in order to actually have that error be handled.
 */
const Errors = {
  400: {
    BadRequest: "Bad request",
    Login: {
      LoggedIn: "Already logged in",
      Username: "User does not exist",
      Password: "Invalid password",
      Deactivated: "This account has been deactivated",
    },
    SignUp: {
      Username: "Username already exists",
      Email: "Email already registered",
    },
    PostArticle: {
      Title: "Title already exists",
      Year: "Invalid year entered",
    },
    Unregistered: "Unregistered account",
  },
  401: {
    Unauthorized: "Unauthorized",
  },
  403: {
    Forbidden: "Forbidden",
  },
  404: {
    NotFound: "Page not found",
  },
  418: {
    Teapot: "I'm a teapot",
  },
  500: {
    InternalServerError: "Internal server error",
    DataGET: "Could not get data",
    DataPOST: "Could not post data",
  },
};

export default Errors;
