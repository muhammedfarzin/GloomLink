import { RequestHandler } from "express";
import { z } from "zod";
import { HttpError } from "../../infrastructure/errors/HttpError";

import { reportTargetSchema } from "../validation/reportSchemas";
import { ReportTarget } from "../../application/use-cases/ReportTarget";
import { ReportRepository } from "../../infrastructure/repositories/ReportRepository";
import { PostRepository } from "../../infrastructure/repositories/PostRepository";
import { UserRepository } from "../../infrastructure/repositories/UserRepository";

export const reportTarget: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== "user") {
      throw new HttpError(401, "Unauthorized");
    }

    const validatedBody = reportTargetSchema.parse(req.body);

    const reportRepository = new ReportRepository();
    const targetRepository =
      validatedBody.type === "post"
        ? new PostRepository()
        : new UserRepository();

    const reportTargetUseCase = new ReportTarget(
      reportRepository,
      targetRepository
    );
    await reportTargetUseCase.execute({
      ...validatedBody,
      reportedBy: req.user.id,
    });

    res
      .status(200)
      .json({ message: `Reported ${validatedBody.type} successfully.` });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return next(new HttpError(400, error.issues[0].message));
    }
    next(error);
  }
};
