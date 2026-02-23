import type { InteractionType } from "../models/Interaction";

export class Interaction {
  private readonly id: string;
  private readonly userId: string;
  private readonly postId: string;
  private readonly type: "view" | "like" | "comment" | "save";
  private readonly weight: number;
  private readonly createdAt: Date;

  constructor(props: InteractionProps) {
    this.id = props.id;
    this.userId = props.userId;
    this.postId = props.postId;
    this.type = props.type;
    this.weight = props.weight;
    this.createdAt = props.createdAt ?? new Date();
  }

  // ---------------- GETTERS ----------------

  public getId(): InteractionType["id"] {
    return this.id;
  }

  public getUserId(): InteractionType["userId"] {
    return this.userId;
  }

  public getPostId(): InteractionType["postId"] {
    return this.postId;
  }

  public getType(): InteractionType["type"] {
    return this.type;
  }

  public getWeight(): InteractionType["weight"] {
    return this.weight;
  }

  public getCreatedAt(): InteractionType["createdAt"] {
    return this.createdAt;
  }

  // --------- Boolean helpers ---------

  public isView(): boolean {
    return this.type === "view";
  }

  public isLike(): boolean {
    return this.type === "like";
  }

  public isComment(): boolean {
    return this.type === "comment";
  }

  public isSave(): boolean {
    return this.type === "save";
  }
}

type InteractionProps = Omit<InteractionType, "createdAt"> & {
  createdAt?: Date;
};
