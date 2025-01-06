import { NextFunction, Request, Response } from "express";
import { HttpError } from "../../infrastructure/errors/HttpError.js";

const errorMiddleware = (
  err: HttpError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const status = err.statusCode || 500;
  const message = err.message || "Something went wrong";

  res.status(status).json({
    status,
    message,
  });
};

export default errorMiddleware;
