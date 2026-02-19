import { injectable, inject } from "inversify";
import { User } from "../../domain/entities/User";
import { Post } from "../../domain/entities/Post";
import { IReportRepository } from "../../domain/repositories/IReportRepository";
import { IPostRepository } from "../../domain/repositories/IPostRepository";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { HttpError } from "../../infrastructure/errors/HttpError";
import { TYPES } from "../../shared/types";
import {
  IReportTarget,
  type ReportTargetInput,
} from "../../domain/use-cases/IReportTarget";

const REPORT_THRESHOLD = 5;

@injectable()
export class ReportTarget implements IReportTarget {
  constructor(
    @inject(TYPES.IReportRepository)
    private reportRepository: IReportRepository,
    @inject(TYPES.IUserRepository)
    private userRepository: IUserRepository,
    @inject(TYPES.IPostRepository)
    private postRepository: IPostRepository,
  ) {}

  async execute(input: ReportTargetInput): Promise<void> {
    const { targetId, type } = input;
    const targetRepo =
      type === "post" ? this.postRepository : this.userRepository;
    const target = await targetRepo.findById(targetId);

    // ---Checking target exists---

    if (!target) {
      throw new HttpError(
        404,
        `${type[0].toUpperCase() + type.slice(1)} to report not found.`,
      );
    }

    // ---Creating report---
    await this.reportRepository.create(input);

    // ---Check Report Count and Block if Necessary---
    const reportCount = await this.reportRepository.countByTarget(targetId);

    if (reportCount >= REPORT_THRESHOLD) {
      target.updateStatus("blocked");
      if (target instanceof User) {
        await this.userRepository.update(targetId, target);
      } else {
        await this.postRepository.update(targetId, target);
      }
    }
  }
}
