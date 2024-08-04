/**
 * Abstract HttpError class.
 */
class HttpError {
  static throwHttp(req, res) {
    throw new Error("Method 'throwHttp(req, res)' not implemented.");
  }
}

export class ErrorToken extends HttpError {
  static throwHttp(req, res) {
    res.status(404).json({ error: "No Token Provided." });
  }
}

export class ErrorWrongPassword extends HttpError {
  static throwHttp(req, res) {
    res.status(400).json({ error: "Wrong Password." });
  }
}

export class ErrorIncorrectUser extends HttpError {
  static throwHttp(req, res) {
    res.status(403).json({ error: "User is incorrect." });
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
    res.status(400).json({ error: "User is not registered." });
  }
}

export class ErrorUserLoggedIn extends HttpError {
  static throwHttp(req, res) {
    res.status(400).json({ error: "User is logged in." });
  }
}

export class ErrorUnexpected extends HttpError {
  static throwHttp(req, res) {
    res.status(500).json({ error: "Unexpected error." });
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

export class ErrorInvalidArticleStatus extends HttpError {
  static throwHttp(req, res) {
    res.status(400).json({ error: "Invalid Article Status sent." });
  }
}

export class ErrorInvalidArticleAuthors extends HttpError {
  static throwHttp(req, res) {
    res.status(400).json({ error: "Invalid Author Usernames sent." });
  }
}

export class ErrorUserAlreadyExists extends HttpError {
  static throwHttp(req, res) {
    res.status(400).json({ error: "Username or email already registered." });
  }
}

export class ErrorDatabaseConnection extends HttpError {
  static throwHttp(req, res) {
    res.status(500).json({ error: "Failed to connect to the database." });
  }
}

export class UnexpectedError extends HttpError {
  static throwHttp(req, res) {
    res.status(500).json({ error: "Encountered an unexpected error." });
  }
}
