import type { LikeType } from "../models/Like";

export class Like {
  private readonly id: string;
  private readonly userId: string;
  private readonly targetId: string;
  private readonly targetType: "post";

  constructor(props: LikeType) {
    this.id = props.id ?? crypto.randomUUID();
    this.userId = props.userId;
    this.targetId = props.targetId;
    this.targetType = props.type;
  }

  // ---------------- GETTERS ----------------

  public getId(): LikeType["id"] {
    return this.id;
  }

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
