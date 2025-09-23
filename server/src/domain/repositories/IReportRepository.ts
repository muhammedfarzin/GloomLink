import { Report } from "../entities/Report";

export type ReportableType = "post" | "user";

export interface IReportRepository {
  create(reportData: {
    targetId: string;
    reportedBy: string;
    type: ReportableType;
  }): Promise<Report>;

  countByTarget(targetId: string): Promise<number>;

  findByTargetAndUser(reportQuery: {
    targetId: string;
    reportedBy: string;
    type: ReportableType;
  }): Promise<Report | null>;
}
