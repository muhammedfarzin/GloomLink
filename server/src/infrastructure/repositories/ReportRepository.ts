import type { Model } from "mongoose";
import { inject, injectable } from "inversify";
import { TYPES } from "@/shared/types";
import type { Report } from "@/domain/entities/Report";
import type { IReportRepository } from "@/domain/repositories/IReportRepository";
import type { ReportDocument } from "../database/models/ReportModel";
import { ReportMapper } from "../mappers/ReportMapper";
import { BaseRepository } from "./BaseRepository";

@injectable()
export class ReportRepository
  extends BaseRepository<Report, ReportDocument>
  implements IReportRepository
{
  constructor(
    @inject(TYPES.ReportModel) protected readonly model: Model<ReportDocument>,
    @inject(TYPES.ReportMapper) protected readonly mapper: ReportMapper,
  ) {
    super();
  }

  async create(reportData: Report): Promise<Report> {
    // ---Checking user already reported the target---
    const existingReport = await this.getExistingReport(reportData);
    if (existingReport) return existingReport;

    // ---Creating report---
    const reportToPersist = this.mapper.toPersistence(reportData);
    const newReportModel = new this.model(reportToPersist);
    const savedReport = await newReportModel.save();
    return this.mapper.toDomain(savedReport);
  }

  countByTarget(targetId: string): Promise<number> {
    return this.model.countDocuments({ targetId });
  }

  async getExistingReport(report: Report): Promise<Report | null> {
    const { id, ...reportQuery } = this.mapper.toPersistence(report);
    const reportModel = await this.model.findOne(reportQuery);

    return reportModel && this.mapper.toDomain(reportModel);
  }
}
