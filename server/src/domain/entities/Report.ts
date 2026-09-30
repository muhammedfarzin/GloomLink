import type { ReportType } from "../models/Report";
import { BaseEntity } from "./BaseEntity";

export class Report extends BaseEntity {
  private readonly type: "post" | "user";
  private readonly targetId: string;
  private readonly reportedBy: string;

  constructor(props: ReportType) {
    super(props);
    this.type = props.type;
    this.targetId = props.targetId;
    this.reportedBy = props.reportedBy;
  }

  // ---------------- GETTERS ----------------

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
