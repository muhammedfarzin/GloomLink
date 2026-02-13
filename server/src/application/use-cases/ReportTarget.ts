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
    let user: User | null = null;
    let post: Post | null = null;

    if (type === "post") {
      post = await this.postRepository.findById(targetId);
    } else {
      user = await this.userRepository.findById(targetId);
    }

    // ---Checking target exists---

    if (!user && !post) {
      throw new HttpError(
        404,
        `${type[0].toUpperCase() + type.slice(1)} to report not found.`,
      );
    }

    // ---Checking user already reported the target---
    const existingReport =
      await this.reportRepository.findByTargetAndUser(input);

    if (existingReport) return;

    // ---Creating report---
    await this.reportRepository.create(input);

    // ---Check Report Count and Block if Necessary---
    const reportCount = await this.reportRepository.countByTarget(targetId);

    if (reportCount >= REPORT_THRESHOLD) {
      const newStatus = "blocked";
      if (type === "post") {
        await this.postRepository.update(targetId, { status: newStatus });
      } else {
        user!.updateStatus(newStatus);
        await this.userRepository.update(targetId, user!);
      }
    }
  }
}
