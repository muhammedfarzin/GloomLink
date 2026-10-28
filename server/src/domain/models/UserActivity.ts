export interface UserActivityType {
  id: string;
  userId: string;
  targetId: string;
  targetType: "post" | "comment";
  action: "view" | "like" | "save";
  metadata: Record<string, unknown>;
  createdAt: Date;
}
