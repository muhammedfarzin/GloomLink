import { Report } from "../entities/Report";

export interface IReportRepository {
  create(reportData: Report): Promise<Report>;

  countByTarget(targetId: string): Promise<number>;

  getExistingReport(reportQuery: Report): Promise<Report | null>;
}

export type ReportableType = "post" | "user";
