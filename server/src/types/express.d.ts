import type { Request } from "express";
import type { User } from "../infrastructure/database/models/UserModel";
import type { TokenPayloadType } from "./tokens";

declare module "express-serve-static-core" {
  interface Request {
    user?:
      | { role: "admin"; id: string }
      | {
          role: "user";
          id: string;
          firstname: string;
          lastname: string;
          username: string;
          email: string;
          authType: "email" | "google";
          status: "active" | "inactive" | "blocked" | "not-verified";
        };
  }
}
