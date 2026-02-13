import { ReportableType } from "../repositories/IReportRepository";

export interface IReportTarget {
  execute(input: ReportTargetInput): Promise<void>;
}

export interface ReportTargetInput {
  targetId: string;
  reportedBy: string;
  type: ReportableType;
}
