/**
 * Abstract HttpError class.
 */
class HttpError {
  static throwHttp(req, res) {
    throw new Error("Method 'throwHttp(req, res)' not implemented.");
  }
}

export class ErrorUserNotFound extends HttpError {
  static throwHttp(req, res) {
    res.status(404).json({ error: "User not found." });
  }
}

export class ErrorUserDeactivated extends HttpError {
  static throwHttp(req, res) {
    res.status(404).json({ error: "User is deactavated." });
  }
}

export class ErrorUserNotRegistered extends HttpError {
  static throwHttp(req, res) {
    res.status(404).json({ error: "User is not registered." });
  }
}

export class ErrorUserLoggedIn extends HttpError {
  static throwHttp(req, res) {
    res.status(404).json({ error: "User is logged in." });
  }
}

export class ErrorArticleNotFound extends HttpError {
  static throwHttp(req, res) {
    res.status(404).json({ error: "Article not found." });
  }
}

export class ErrorIssueMapNotFound extends HttpError {
  static throwHttp(req, res) {
    res.status(404).json({ error: "Issue Map not found." });
  }
}

export class ErrorValidation extends HttpError {
  static throwHttp(req, res) {
    res.status(400).json({ error: "Malformed API Model." });
  }
}
