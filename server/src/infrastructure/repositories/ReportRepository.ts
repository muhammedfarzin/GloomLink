import { injectable } from "inversify";
import { IReportRepository } from "../../domain/repositories/IReportRepository";
import { Report } from "../../domain/entities/Report";
import { ReportDocument, ReportModel } from "../database/models/ReportModel";
import { ReportMapper } from "../mappers/ReportMapper";
import { ReportType } from "../../domain/models/Report";

@injectable()
export class ReportRepository implements IReportRepository {
  async create(reportData: Report): Promise<Report> {
    // ---Checking user already reported the target---
    const existingReport = await this.getExistingReport(reportData);
    if (existingReport) return existingReport;

    // ---Creating report---
    const reportToPersist = ReportMapper.toPersistence(reportData);
    const newReportModel = new ReportModel(reportToPersist);
    const savedReport = await newReportModel.save();
    return ReportMapper.toDomain(this.safeParseReportDoc(savedReport));
  }

  countByTarget(targetId: string): Promise<number> {
    return ReportModel.countDocuments({ targetId });
  }

  async getExistingReport(report: Report): Promise<Report | null> {
    const { reportId, ...reportQuery } = ReportMapper.toPersistence(report);
    const reportModel = await ReportModel.findOne(reportQuery);

    return reportModel
      ? ReportMapper.toDomain(this.safeParseReportDoc(reportModel))
      : null;
  }

  private safeParseReportDoc(reportDoc: ReportDocument): ReportType {
    return {
      reportId: reportDoc._id.toString(),
      type: reportDoc.type,
      targetId: reportDoc.targetId.toString(),
      reportedBy: reportDoc.reportedBy.toString(),
    };
  }
}
