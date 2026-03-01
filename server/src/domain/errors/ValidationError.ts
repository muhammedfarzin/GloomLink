import { AppError } from "./AppError";

export class ValidationError extends AppError {
  constructor(public message: string) {
    super(message, "VALIDATION");
  }
}

export class InvalidUrlError extends ValidationError {
  constructor(message?: string) {
    super(message || "Invalid URL");
  }
}
