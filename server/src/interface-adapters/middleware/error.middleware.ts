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
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let status = 500;
  let message = error.message || "Something went wrong";
  let fieldErrors: Record<string, string> | undefined;

  if (error instanceof ZodError) {
    status = 400;
    message = error.issues[0].message;
    fieldErrors = {};
    for (const issue of error.issues) {
      const field = issue.path[0];
      if (typeof field === "string" && !fieldErrors[field]) {
        fieldErrors[field] = issue.message;
      }
    }
  } else if (error instanceof FormValidationError) {
    fieldErrors = error.errors;
    status = ErrorToHttpStatusCode[error.type];
  } else if (error instanceof AppError) {
    status = ErrorToHttpStatusCode[error.type];
  } else if (error instanceof HttpError) {
    status = error.statusCode;
  } else {
    console.error(error);
  }

  res.status(status).json({
    status,
    message,
    errors: fieldErrors ?? {},
  });
};

export default errorMiddleware;
