import { AppError } from "./AppError";

export class UnauthorizedError extends AppError {
  constructor(message?: string) {
    super(message || "Unauthorized access", "UNAUTHORIZED");
  }
}

export class InvalidCredentialsError extends AppError {
  constructor(message?: string) {
    super(message || "Invalid credentials", "INVALID_CREDENTIALS");
  }
}

export class ForbiddenError extends AppError {
  constructor(message?: string) {
    super(message || "Forbidden access", "FORBIDDEN");
  }
}
