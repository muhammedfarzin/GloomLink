import type { CommentType } from "../models/Comment";

export class Comment {
  private readonly id: string;
  private readonly targetId: string;
  private readonly userId: string;
  private comment: string;
  private readonly type: "post" | "comment";
  private readonly createdAt: Date;
  private updatedAt: Date;

  constructor(props: CommentProps) {
    this.id = props.id;
    this.targetId = props.targetId;
    this.userId = props.userId;
    this.comment = props.comment;
    this.type = props.type;
    this.createdAt = props.createdAt ?? new Date();
    this.updatedAt = props.updatedAt ?? this.createdAt;
  }

  // ---------------- SETTERS ----------------

  public updateComment(comment: string): void {
    this.comment = comment;
    this.updatedAt = new Date();
  }

  // ---------------- GETTERS ----------------

  public getId(): CommentType["id"] {
    return this.id;
  }

  public getTargetId(): CommentType["targetId"] {
    return this.targetId;
  }

  public getUserId(): CommentType["userId"] {
    return this.userId;
  }

  public getComment(): CommentType["comment"] {
    return this.comment;
  }

  public getType(): CommentType["type"] {
    return this.type;
  }

  public getCreatedAt(): CommentType["createdAt"] {
    return this.createdAt;
  }

  public getUpdatedAt(): CommentType["updatedAt"] {
    return this.updatedAt;
  }

  // --------- Boolean helpers ---------

  public isForPost(): boolean {
    return this.type === "post";
  }

  public isForComment(): boolean {
    return this.type === "comment";
  }

  public isOwnedBy(userId: string): boolean {
    return this.userId === userId;
  }

  public isTargetSameAs(targetId: string, type: CommentType["type"]): boolean {
    return this.targetId === targetId && this.type === type;
  }

  public isUpdated(): boolean {
    return this.updatedAt.getTime() > this.createdAt.getTime();
  }
}

type CommentProps = Omit<CommentType, "createdAt" | "updatedAt"> & {
  createdAt?: Date;
  updatedAt?: Date;
};
