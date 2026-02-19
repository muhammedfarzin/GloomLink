import type { ReportType } from "../models/Report";

export class Report {
  private readonly reportId: string;
  private readonly type: "post" | "user";
  private readonly targetId: string;
  private readonly reportedBy: string;

  constructor(props: ReportType) {
    this.reportId = props.reportId;
    this.type = props.type;
    this.targetId = props.targetId;
    this.reportedBy = props.reportedBy;
  }

  // ---------------- GETTERS ----------------

  getId(): ReportType["reportId"] {
    return this.reportId;
  }

  getType(): ReportType["type"] {
    return this.type;
  }

  getTargetId(): ReportType["targetId"] {
    return this.targetId;
  }

  getReportedUserId(): Report["reportedBy"] {
    return this.reportedBy;
  }

  // --------- Boolean helpers ---------

  isPostType(): boolean {
    return this.type === "post";
  }

  isUserType(): boolean {
    return this.type === "user";
  }

  isReportedBy(userId: string): boolean {
    return userId === this.reportedBy;
  }
}
