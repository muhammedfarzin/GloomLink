import { injectable } from "inversify";
import { ReportModel } from "../database/models/ReportModel";
import { ReportMapper } from "../mappers/ReportMapper";
import type { IReportRepository } from "@/domain/repositories/IReportRepository";
import type { Report } from "@/domain/entities/Report";

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
    return ReportMapper.toDomain(savedReport);
  }

  async findById(id: string): Promise<Report | null> {
    const reportDoc = await ReportModel.findById(id);
    return reportDoc && ReportMapper.toDomain(reportDoc);
  }

  countByTarget(targetId: string): Promise<number> {
    return ReportModel.countDocuments({ targetId });
  }

  async getExistingReport(report: Report): Promise<Report | null> {
    const { id, ...reportQuery } = ReportMapper.toPersistence(report);
    const reportModel = await ReportModel.findOne(reportQuery);

    return reportModel && ReportMapper.toDomain(reportModel);
  }

  async update(data: Report): Promise<Report | null> {
    const { id, ...updateData } = ReportMapper.toPersistence(data);
    const updatedReport = await ReportModel.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    return updatedReport && ReportMapper.toDomain(updatedReport);
  }

  async deleteById(id: string): Promise<Report | null> {
    const deletedReport = await ReportModel.findByIdAndDelete(id);
    return deletedReport && ReportMapper.toDomain(deletedReport);
  }
}
