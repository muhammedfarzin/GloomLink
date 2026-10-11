import { Mapper } from "./Mapper";
import { injectable } from "inversify";
import { Report } from "@/domain/entities/Report";
import type { ReportType } from "@/domain/models/Report";
import type { ReportDocument } from "../database/models/ReportModel";

@injectable()
export class ReportMapper extends Mapper<Report, ReportType | ReportDocument> {
  public toDomain(report: ReportType | ReportDocument): Report {
    return new Report({
      id: report.id.toString(),
      targetId: report.targetId.toString(),
      reportedBy: report.reportedBy.toString(),
      type: report.type,
    });
  }

  public toPersistence(report: Report): ReportType {
    return {
      id: report.getId(),
      type: report.getType(),
      targetId: report.getTargetId(),
      reportedBy: report.getReportedUserId(),
    };
  }
}
