import { injectable } from "inversify";
import {
  IReportRepository,
  type ReportInput,
} from "../../domain/repositories/IReportRepository";
import { Report } from "../../domain/entities/Report";
import { ReportModel } from "../database/models/ReportModel";
import { ReportMapper } from "../mappers/ReportMapper";

@injectable()
export class ReportRepository implements IReportRepository {
  async create(reportData: ReportInput): Promise<Report> {
    // ---Checking user already reported the target---
    const existingReport = await this.findByTargetAndUser(reportData);
    if (existingReport) return existingReport;

    // ---Creating report---
    const reportToPersist = ReportMapper.toPersistence(reportData);
    const newReportModel = new ReportModel(reportToPersist);
    const savedReport = await newReportModel.save();
    return ReportMapper.toDomain(savedReport);
  }

  countByTarget(targetId: string): Promise<number> {
    return ReportModel.countDocuments({ targetId });
  }

  async findByTargetAndUser(reportQuery: ReportInput): Promise<Report | null> {
    const reportModel = await ReportModel.findOne(reportQuery);

    return reportModel ? ReportMapper.toDomain(reportModel) : null;
  }
}
