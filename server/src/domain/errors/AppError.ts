export class AppError extends Error {
  constructor(
    message?: string,
    public readonly type: ErrorType = "INTERNAL",
  ) {
    super(message || "Something went wrong");
  }
}

export type ErrorType =
  | "NOT_FOUND"
  | "VALIDATION"
  | "UNAUTHORIZED"
  | "CONFLICT"
  | "INTERNAL"
  | "FORBIDDEN"
  | "INVALID_CREDENTIALS";
