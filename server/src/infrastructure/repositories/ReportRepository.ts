import { injectable } from "inversify";
import type { Report } from "@/domain/entities/Report";
import type { IReportRepository } from "@/domain/repositories/IReportRepository";
import type { ReportDocument } from "../database/models/ReportModel";
import { ReportModel } from "../database/models/ReportModel";
import { ReportMapper } from "../mappers/ReportMapper";
import { BaseRepository } from "./BaseRepository";

@injectable()
export class ReportRepository
  extends BaseRepository<Report, ReportDocument>
  implements IReportRepository
{
  protected readonly model = ReportModel;
  protected readonly mapper = ReportMapper;

  async create(reportData: Report): Promise<Report> {
    // ---Checking user already reported the target---
    const existingReport = await this.getExistingReport(reportData);
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

  async getExistingReport(report: Report): Promise<Report | null> {
    const { id, ...reportQuery } = ReportMapper.toPersistence(report);
    const reportModel = await ReportModel.findOne(reportQuery);

    return reportModel && ReportMapper.toDomain(reportModel);
  }
}
