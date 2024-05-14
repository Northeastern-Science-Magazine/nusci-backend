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
  constructor(msg) {
    super(msg);
  }
}

export class ErrorCannotInitializeAbstractClass extends InternalError {
  constructor(msg) {
    super(msg);
  }
}

export class ErrorAbstractMethodNotInstantiated extends InternalError {
  constructor(msg) {
    super(msg);
  }
}
