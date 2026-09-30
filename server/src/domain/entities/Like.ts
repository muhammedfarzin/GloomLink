import type { LikeType } from "../models/Like";
import { BaseEntity } from "./BaseEntity";

export class Like extends BaseEntity {
  private readonly userId: string;
  private readonly targetId: string;
  private readonly targetType: "post";

  constructor(props: LikeType) {
    super(props);
    this.userId = props.userId;
    this.targetId = props.targetId;
    this.targetType = props.type;
  }

  // ---------------- GETTERS ----------------

  public getUserId(): LikeType["userId"] {
    return this.userId;
  }

  public getTargetId(): LikeType["targetId"] {
    return this.targetId;
  }

  public getTargetType(): LikeType["type"] {
    return this.targetType;
  }

  // --------- Boolean helpers ---------

  public isLikedBy(userId: string): boolean {
    return this.userId === userId;
  }

  public isTargetSameAs(targetId: string, type: LikeType["type"]): boolean {
    return this.targetId === targetId && this.targetType === type;
  }
}
