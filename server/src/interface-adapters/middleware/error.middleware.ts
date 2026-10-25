import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { AppError, type ErrorType } from "@/domain/errors/AppError.js";
import { HttpError } from "../errors/HttpError.js";
import { FormValidationError } from "@/domain/errors/FormValidationError.js";

export const ErrorToHttpStatusCode: Record<ErrorType, number> = {
  NOT_FOUND: 404,
  VALIDATION: 400,
  UNAUTHORIZED: 401,
  INVALID_CREDENTIALS: 401,
  FORBIDDEN: 403,
  CONFLICT: 409,
  INTERNAL: 500,
};

const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let status = 500;
  let message = err.message || "Something went wrong";
  let fieldErrors: Record<string, string> | undefined;

  if (err instanceof ZodError) {
    status = 400;
    message = err.issues[0].message;
    fieldErrors = {};
    for (const issue of err.issues) {
      const field = issue.path[0];
      if (typeof field === "string" && !fieldErrors[field]) {
        fieldErrors[field] = issue.message;
      }
    }
  } else if (err instanceof FormValidationError) {
    fieldErrors = err.errors;
    status = ErrorToHttpStatusCode[err.type];
  } else if (err instanceof AppError) {
    status = ErrorToHttpStatusCode[err.type];
  } else if (err instanceof HttpError) {
    status = err.statusCode;
  }

  res.status(status).json({
    status,
    message,
    errors: fieldErrors ?? {},
  });
};

export default errorMiddleware;
