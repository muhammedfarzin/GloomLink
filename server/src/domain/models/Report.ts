export interface ReportType {
  reportId: string;
  type: "post" | "user";
  targetId: string;
  reportedBy: string;
}
