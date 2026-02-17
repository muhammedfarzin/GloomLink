export interface AuthUser {
  role: "user";
  id: string;
  firstname: string;
  lastname?: string;
  username: string;
  email: string;
  authType: "email" | "google";
  status: "active" | "inactive" | "blocked" | "not-verified";
}
