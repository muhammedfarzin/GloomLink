import { AppError, type ErrorType } from "./AppError";

export class FormValidationError extends AppError {
  constructor(
    public readonly errors: Record<string, string>,
    message?: string,
    type: ErrorType = "VALIDATION",
  ) {
    super(
      message || Object.values(errors)[0] || "Form validation failed",
      type,
    );
  }
}

export class FormConflictError extends FormValidationError {
  constructor(errors: Record<string, string>, message?: string) {
    super(errors, message, "CONFLICT");
  }
}
