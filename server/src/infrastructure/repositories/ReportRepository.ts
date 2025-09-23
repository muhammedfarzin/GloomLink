import {
  IReportRepository,
  ReportableType,
} from "../../domain/repositories/IReportRepository";
import { Report } from "../../domain/entities/Report";
import { ReportModel } from "../database/models/ReportModel";
import { ReportMapper } from "../database/mappers/ReportMapper";

export class ReportRepository implements IReportRepository {
  async create(reportData: {
    targetId: string;
    reportedBy: string;
    type: ReportableType;
  }): Promise<Report> {
    const reportToPersist = ReportMapper.toPersistence(reportData);
    const newReportModel = new ReportModel(reportToPersist);
    const savedReport = await newReportModel.save();
    return ReportMapper.toDomain(savedReport);
  }

  countByTarget(targetId: string): Promise<number> {
    return ReportModel.countDocuments({ targetId });
  }

  async findByTargetAndUser(reportQuery: {
    targetId: string;
    reportedBy: string;
    type: ReportableType;
  }): Promise<Report | null> {
    const reportModel = await ReportModel.findOne(reportQuery);

    return reportModel ? ReportMapper.toDomain(reportModel) : null;
  }
}
