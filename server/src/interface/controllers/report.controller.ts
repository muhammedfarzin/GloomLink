import { RequestHandler } from "express";
import { HttpError } from "../../infrastructure/errors/HttpError";
import { reportTargetSchema } from "../validation/reportSchemas";
import { ReportTarget } from "../../application/use-cases/ReportTarget";
import container from "../../shared/inversify.config";
import { TYPES } from "../../shared/types";

export const reportTarget: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== "user") {
      throw new HttpError(401, "Unauthorized");
    }

    const validatedBody = reportTargetSchema.parse(req.body);

    const reportTargetUseCase = container.get<ReportTarget>(TYPES.ReportTarget);

    await reportTargetUseCase.execute({
      ...validatedBody,
      reportedBy: req.user.id,
    });

    res
      .status(200)
      .json({ message: `Reported ${validatedBody.type} successfully.` });
  } catch (error) {
    next(error);
  }
};
