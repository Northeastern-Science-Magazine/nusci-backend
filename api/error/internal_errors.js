class InternalError extends Error {
  constructor(msg) {
    super(msg);
  }
}

export class ErrorInternalAPIModelValidation extends InternalError {
  constructor() {
    super("API Model Validation Error.");
  }
}

export class ErrorInternalEnumValidation extends InternalError {
  constructor() {
    super("Enum Validation Error.");
  }
}
