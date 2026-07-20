import { Report } from "@/domain/entities/Report";
import type { ReportType } from "@/domain/models/Report";
import type { ReportDocument } from "../database/models/ReportModel";

export class ReportMapper {
  public static toDomain(report: ReportType | ReportDocument): Report {
    return new Report({
      id: report.id.toString(),
      targetId: report.targetId.toString(),
      reportedBy: report.reportedBy.toString(),
      type: report.type,
    });
  }

  public static toPersistence(report: Report): ReportType {
    return {
      id: report.getId(),
      type: report.getType(),
      targetId: report.getTargetId(),
      reportedBy: report.getReportedUserId(),
    };
  }
}
