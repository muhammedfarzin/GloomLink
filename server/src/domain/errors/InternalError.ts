import { AppError } from "./AppError";

export class InternalError extends AppError {
  constructor(message: string) {
    super(message, "INTERNAL");
  }
}

export class StorageServiceError extends InternalError {
  constructor(message?: string) {
    super(message || "The file storage service is currently unavailable.");
  }
}
