import { Report } from "../entities/Report";

export interface IReportRepository {
  create(reportData: ReportInput): Promise<Report>;

  countByTarget(targetId: string): Promise<number>;

  findByTargetAndUser(reportQuery: ReportInput): Promise<Report | null>;
}

export type ReportableType = "post" | "user";

export interface ReportInput {
  targetId: string;
  reportedBy: string;
  type: ReportableType;
}
