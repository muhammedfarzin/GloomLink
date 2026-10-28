import type { UserActivity } from "../entities/UserActivity";
import type { UserActivityType } from "../models/UserActivity";

export interface IRecordUserActivity {
  execute(input: RecordUserActivityInput): Promise<UserActivity>;
}

export type RecordUserActivityInput = Pick<
  UserActivityType,
  "userId" | "targetId" | "targetType" | "action"
> & {
  metadata?: Record<string, unknown>;
};
