import { injectable, inject } from "inversify";
import { User } from "../../domain/entities/User";
import { Report } from "../../domain/entities/Report";
import { NotFoundError } from "../../domain/errors/NotFoundErrors";
import { TYPES } from "../../shared/types";
import type { IReportRepository } from "../../domain/repositories/IReportRepository";
import type { IPostRepository } from "../../domain/repositories/IPostRepository";
import type { IUserRepository } from "../../domain/repositories/IUserRepository";
import type {
  IReportTarget,
  ReportTargetInput,
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
      throw new NotFoundError(
        `${type[0].toUpperCase() + type.slice(1)} to report not found.`,
      );
    }

    // ---Creating report---
    const reportToCreate = new Report({
      ...input,
      reportId: crypto.randomUUID(),
    });

    await this.reportRepository.create(reportToCreate);

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
