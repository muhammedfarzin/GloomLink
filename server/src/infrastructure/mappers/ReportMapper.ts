import { Report } from "../../domain/entities/Report";
import { ReportType } from "../../domain/models/Report";

export class ReportMapper {
  public static toDomain(report: ReportType): Report {
    return new Report(report);
  }

  public static toPersistence(report: Report): ReportType {
    return {
      reportId: report.getId(),
      type: report.getType(),
      targetId: report.getTargetId(),
      reportedBy: report.getReportedUserId(),
    };
  }
}
