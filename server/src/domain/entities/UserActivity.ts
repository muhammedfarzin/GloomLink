import type { UserActivityType } from "../models/UserActivity";
import { BaseEntity } from "./BaseEntity";

export class UserActivity extends BaseEntity {
  private readonly userId: UserActivityType["userId"];
  private readonly targetId: UserActivityType["targetId"];
  private readonly targetType: UserActivityType["targetType"];
  private readonly action: UserActivityType["action"];
  private readonly metadata: UserActivityType["metadata"];
  private readonly createdAt: UserActivityType["createdAt"];

  constructor(
    props: Omit<UserActivityType, "createdAt"> & { createdAt?: Date },
  ) {
    super(props);
    this.userId = props.userId;
    this.targetId = props.targetId;
    this.targetType = props.targetType;
    this.action = props.action;
    this.metadata = props.metadata;
    this.createdAt = props.createdAt ?? new Date();
  }

  getUserId() {
    return this.userId;
  }

  getTargetId() {
    return this.targetId;
  }

  getTargetType() {
    return this.targetType;
  }

  getAction() {
    return this.action;
  }

  getMetadata() {
    return this.metadata;
  }

  getCreatedAt() {
    return this.createdAt;
  }
}
