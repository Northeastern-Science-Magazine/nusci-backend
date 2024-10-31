class InternalError extends Error {
  constructor(msg) {
    super(msg);
  }
}

export class ErrorInternalAPIModelFieldValidation extends InternalError {
  constructor(msg) {
    super(msg);
  }
}

export class ErrorInternalAPIModelValidation extends InternalError {
  constructor(msg) {
    super(msg);
  }
}

export class ErrorInternalEnumValidation extends InternalError {
  constructor() {
    super("Enum Validation Error.");
  }
}
