import type { UserActivityType } from "../models/UserActivity";
import type { UserCompact } from "../models/User";
import type { EnrichedPost } from "../models/Post";
import type { UserActivity } from "../entities/UserActivity";
import type { IBaseRepository } from "./IBaseRepository";

export interface IUserActivityRepository extends IBaseRepository<UserActivity> {
  hasActivity(
    userId: string,
    targetId: string,
    targetType: UserActivityType["targetType"],
    action: UserActivityType["action"],
  ): Promise<boolean>;
  isLiked(
    userId: string,
    targetId: string,
    targetType: UserActivityType["targetType"],
  ): Promise<boolean>;
  toggleLike(
    userId: string,
    targetId: string,
    targetType: UserActivityType["targetType"],
  ): Promise<boolean>;
  getUsersByTarget(
    targetId: string,
    options: UserActivityUsersOptions,
  ): Promise<UserCompact[]>;
  isPostSaved(userId: string, postId: string): Promise<boolean>;
  getSavedPosts(
    userId: string,
    page: number,
    limit: number,
  ): Promise<EnrichedPost[]>;
  toggleSavePost(userId: string, postId: string): Promise<boolean>;
  create(activity: UserActivity): Promise<UserActivity>;
  findById(id: string): Promise<UserActivity | null>;
  findByUserId(userId: string, limit?: number): Promise<UserActivity[]>;
  getTopInteractedTags(userId: string, limit?: number): Promise<string[]>;
  getDashboardMetrics(
    startDate: Date,
    endDate: Date,
  ): Promise<UserActivityDashboardMetrics>;
  update(data: UserActivity): Promise<UserActivity | null>;
  deleteById(id: string): Promise<UserActivity | null>;
}

export interface UserActivityDashboardMetrics {
  totalInteractions: number;
  activeUsers: number;
  chartData: { date: string; count: number }[];
}

export interface UserActivityUsersOptions {
  userId?: string;
  targetType: UserActivityType["targetType"];
  action: UserActivityType["action"];
  page: number;
  limit: number;
}
