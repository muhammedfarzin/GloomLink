import { injectable, inject } from "inversify";
import {
  IReportRepository,
  ReportableType,
} from "../../domain/repositories/IReportRepository";
import { IPostRepository } from "../../domain/repositories/IPostRepository";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { HttpError } from "../../infrastructure/errors/HttpError";
import { TYPES } from "../../shared/types";

export interface ReportTargetInput {
  targetId: string;
  reportedBy: string;
  type: ReportableType;
}

const REPORT_THRESHOLD = 5;

@injectable()
export class ReportTarget {
  constructor(
    @inject(TYPES.IReportRepository)
    private reportRepository: IReportRepository,
    @inject(TYPES.IUserRepository)
    private userRepository: IUserRepository,
    @inject(TYPES.IPostRepository)
    private postRepository: IPostRepository
  ) {}

  async execute(input: ReportTargetInput): Promise<void> {
    const { targetId, type } = input;

    const targetRepository =
      type === "post" ? this.postRepository : this.userRepository;

    // ---Checking target exists---
    const target = await targetRepository.findById(targetId);
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
      await targetRepository.update(targetId, { status: "blocked" });
    }
  }
}
