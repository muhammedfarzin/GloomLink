import { NextFunction, Request, Response } from "express";
import { HttpError } from "../../infrastructure/errors/HttpError.js";
import { ZodError } from "zod";

const errorMiddleware = (
  err: HttpError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let status: number, message: string;

  if (err instanceof ZodError) {
    status = err.statusCode || 400;
    message = err.issues[0].message;
  } else {
    status = err.statusCode || 500;
    message = err.message || "Something went wrong";
  }

  res.status(status).json({
    status,
    message,
  });
};

export default errorMiddleware;
