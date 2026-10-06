import { Report } from "../entities/Report";
import { IBaseRepository } from "./IBaseRepository";

export interface IReportRepository extends IBaseRepository<Report> {
  create(reportData: Report): Promise<Report>;
  findById(id: string): Promise<Report | null>;
  countByTarget(targetId: string): Promise<number>;
  getExistingReport(reportQuery: Report): Promise<Report | null>;
  update(data: Report): Promise<Report | null>;
  deleteById(id: string): Promise<Report | null>;
}

export type ReportableType = "post" | "user";

