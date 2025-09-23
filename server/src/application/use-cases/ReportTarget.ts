import {
  IReportRepository,
  ReportableType,
} from "../../domain/repositories/IReportRepository";
import { IPostRepository } from "../../domain/repositories/IPostRepository";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { HttpError } from "../../infrastructure/errors/HttpError";

export interface ReportTargetInput {
  targetId: string;
  reportedBy: string;
  type: ReportableType;
}

const REPORT_THRESHOLD = 5;

export class ReportTarget {
  constructor(
    private reportRepository: IReportRepository,
    private targetRepository: IPostRepository | IUserRepository
  ) {}

  async execute(input: ReportTargetInput): Promise<void> {
    const { targetId, reportedBy, type } = input;

    const target = await this.targetRepository.findById(targetId);
    if (!target) {
      throw new HttpError(
        404,
        `${type[0].toUpperCase() + type.slice(1)} to report not found.`
      );
    }

    // ---Checking user already reported the target---
    const existingReport = await this.reportRepository.findByTargetAndUser(
      input
    );

    if (existingReport) return;

    // ---Creating report---
    await this.reportRepository.create(input);

    // ---Check Report Count and Block if Necessary---
    const reportCount = await this.reportRepository.countByTarget(targetId);

    if (reportCount >= REPORT_THRESHOLD) {
      await this.targetRepository.update(targetId, { status: "blocked" });
    }
  }
}
