export interface ReportType {
  id: string;
  type: "post" | "user";
  targetId: string;
  reportedBy: string;
}
