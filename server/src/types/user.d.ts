import type { UserStatusType } from "@/domain/models/User";

export interface AuthUser {
  role: "user";
  id: string;
  firstname: string;
  lastname?: string;
  username: string;
  email: string;
  authType: "email" | "google";
  status: UserStatusType;
}
