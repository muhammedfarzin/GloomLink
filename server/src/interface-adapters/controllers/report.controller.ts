import { RequestHandler } from "express";
import { inject, injectable } from "inversify";
import { HttpError } from "../errors/HttpError";
import { TYPES } from "../../shared/types";

import type { IReportTarget } from "../../domain/use-cases/IReportTarget";

import { reportTargetSchema } from "../validation/reportSchemas";

@injectable()
export class ReportController {
  constructor(
    @inject(TYPES.IReportTarget) private reportTargetUseCase: IReportTarget,
  ) {}

  reportTarget: RequestHandler = async (req, res, next) => {
    try {
      if (!req.user || req.user.role !== "user") {
        throw new HttpError(401, "Unauthorized");
      }

      const validatedBody = reportTargetSchema.parse(req.body);

      await this.reportTargetUseCase.execute({
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
}
