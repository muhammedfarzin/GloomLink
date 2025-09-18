import { Types } from "mongoose";
import { Report } from "../../../domain/entities/Report";
import { ReportDocument } from "../models/ReportModel";

export class ReportMapper {
  public static toDomain(reportModel: ReportDocument): Report {
    const reportObject = reportModel.toObject<ReportDocument>();

    return {
      ...reportObject,
      _id: reportObject._id.toString(),
      targetId: reportObject.targetId.toString(),
      reportedBy: reportObject.reportedBy.toString(),
    };
  }

  public static toPersistence(report: Partial<Report>): any {
    const persistenceReport: any = { ...report };

    if (report._id) {
      persistenceReport._id = new Types.ObjectId(report._id);
    }
    if (report.targetId) {
      persistenceReport.targetId = new Types.ObjectId(report.targetId);
    }
    if (report.reportedBy) {
      persistenceReport.reportedBy = new Types.ObjectId(report.reportedBy);
    }

    return persistenceReport;
  }
}
