export class HttpError extends Error {
  statusCode: number;

  constructor(statusCode?: number, message?: string) {
    super(message || "Something went wrong");
    this.statusCode = statusCode || 500;
  }
}
