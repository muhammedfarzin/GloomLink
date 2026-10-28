import { Schema, model, type Document, type Types } from "mongoose";
import type { UserActivityType } from "@/domain/models/UserActivity";

export interface UserActivity extends Omit<
  UserActivityType,
  "id" | "userId" | "targetId"
> {
  userId: Types.ObjectId;
  targetId: Types.ObjectId;
}
export type UserActivityDocument = UserActivity & Document;

export const userActivitySchema = new Schema<UserActivity>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  targetId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  targetType: {
    type: String,
    enum: ["post", "comment"],
    required: true,
  },
  action: {
    type: String,
    enum: ["view", "like", "save"],
    required: true,
  },
  metadata: {
    type: Schema.Types.Mixed,
    default: () => ({}),
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

userActivitySchema.index(
  { userId: 1, targetId: 1, targetType: 1, action: 1 },
  { unique: true },
);
userActivitySchema.index({ targetId: 1, targetType: 1, action: 1 });
userActivitySchema.index({ userId: 1, action: 1, createdAt: -1 });

// Only views expire; durable likes and saves must never be capped or expired.
userActivitySchema.index(
  { createdAt: 1 },
  {
    expireAfterSeconds: 30 * 24 * 60 * 60,
    partialFilterExpression: { action: "view" },
  },
);
export const UserActivityModel = model<UserActivity>(
  "UserActivity",
  userActivitySchema,
  "user-activities",
);
