/**
 * Wrapper class for regular error that carries
 * static methods to throw errors across HTTP
 * while keeping regular JS Error behaviour.
 */
export class HttpError extends Error {
  constructor(msg) {
    super(msg);
  }

  throwHttp(req, res) {
    throw new Error("Method 'throwHttp(req, res)' not implemented.");
  }
}

/**
 * 400 Errors
 *
 * Bad request
 */

export class ErrorFailedLogin extends HttpError {
  throwHttp(req, res) {
    res.status(400).json({ error: "Login failed.", message: this.message });
  }
}

export class ErrorUserPendingLogin extends HttpError {
  throwHttp(req, res) {
    res.status(400).json({ error: "Pending users cannot log in. Ask an Admin for approval.", message: this.message });
  }
}

export class ErrorUserDeactivatedLogin extends HttpError {
  throwHttp(req, res) {
    res
      .status(400)
      .json({ error: "Deactivated users cannot log in. Ask an to reactivate your account.", message: this.message });
  }
}

export class ErrorUserDeniedLogin extends HttpError {
  throwHttp(req, res) {
    res.status(400).json({ error: "Denied users cannot log in.", message: this.message });
  }
}

export class ErrorValidation extends HttpError {
  throwHttp(req, res) {
    res.status(400).json({ error: "A validation error occurred.", message: this.message });
  }
}

export class ErrorTypeOfQuery extends HttpError {
  throwHttp(req, res) {
    res.status(400).json({error: "Invalid query type.", message: this.message});
  }
}

/**
 * 403 Errors
 *
 * Forbidden
 */

export class ErrorForbidden extends HttpError {
  throwHttp(req, res) {
    res.status(403).json({ error: "Insufficient permissions to access this resource.", message: this.message });
  }
}

export class ErrorNotLoggedIn extends HttpError {
  throwHttp(req, res) {
    res.status(403).json({ error: "Please log in to access this resource.", message: this.message });
  }
}

/**
 * 404 Errors
 *
 * Not found
 */

export class ErrorUserNotFound extends HttpError {
  throwHttp(req, res) {
    res.status(404).json({ error: "User not found.", message: this.message });
  }
}

export class ErrorArticleNotFound extends HttpError {
  throwHttp(req, res) {
    res.status(404).json({ error: "Article not found.", message: this.message });
  }
}

export class ErrorSectionNotFound extends HttpError {
  throwHttp(req, res) {
    res.status(404).json({ error: "Section not found.", message: this.message });
  }
}

export class ErrorIssueMapNotFound extends HttpError {
  throwHttp(req, res) {
    res.status(404).json({ error: "Issue Map not found.", message: this.message });
  }
}

export class ErrorInvalidRequestBody extends HttpError {
  throwHttp(req, res) {
    res.status(404).json({ error: "Invalid request body.", message: this.message });
  }
}

/**
 * 409 Errors
 *
 * Conflict
 */

export class ErrorUserAlreadyLoggedIn extends HttpError {
  throwHttp(req, res) {
    res.status(409).json({ error: "Already logged in.", message: this.message });
  }
}

export class ErrorUserAlreadyExists extends HttpError {
  throwHttp(req, res) {
    res.status(409).json({ error: "Email already registered with an account.", message: this.message });
  }
}

export class ErrorUserStatusAlreadyResolved extends HttpError {
  throwHttp(req, res) {
    res.status(409).json({ error: "User's status is already resolved.", message: this.message });
  }
}

/**
 * 500 Errors
 *
 * Internal server
 */

export class ErrorDatabaseConnection extends HttpError {
  throwHttp(req, res) {
    res.status(500).json({ error: "Error connecting to the database.", message: this.message });
  }
}

export class ErrorUnexpected extends HttpError {
  throwHttp(req, res) {
    res.status(500).json({ error: "An unexpected error occurred.", message: this.message });
  }
}
