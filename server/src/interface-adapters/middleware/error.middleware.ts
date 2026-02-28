import { NextFunction, Request, Response } from "express";
import { HttpError } from "../errors/HttpError.js";
import { ZodError } from "zod";
import { ValidationError } from "../../domain/errors/ValidationError.js";
import { UnauthorizedError } from "../../domain/errors/UnauthorizedError.js";

const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let status: number, message: string;

  if (err instanceof ZodError) {
    status = 400;
    err.message = err.issues[0].message;
  } else if (err instanceof ValidationError) {
    status = 400;
  } else if (err instanceof UnauthorizedError) {
    status = 401;
  } else if (err instanceof HttpError) {
    status = err.statusCode;
  } else {
    status = 500;
  }
  message = err.message || "Something went wrong";

  res.status(status).json({
    status,
    message,
  });
};

export default errorMiddleware;
