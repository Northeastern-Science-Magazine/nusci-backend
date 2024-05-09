class HttpError extends Error {
  constructor(msg) {
    super(msg);

    if (this.constructor == HttpError) {
      throw new Error("Abstract class HttpError cannot be instantiated.");
    }
  }

  throwHttp(req, res) {
    throw new Error("Method 'throwHttp(req, res)' must be implemented.");
  }
}

class ErrorUserNotFound extends HttpError {
  throwHttp(req, res) {
    res.status = 404;
    res.json({ error: "User not found." });
  }
}
