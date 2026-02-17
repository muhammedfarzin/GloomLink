import type { Request } from "express";
import type { User } from "../infrastructure/database/models/UserModel";
import type { TokenPayloadType } from "./tokens";
import type { AuthUser } from "./user";

declare module "express-serve-static-core" {
  interface Request {
    user?: AuthUser | { role: "admin"; id: string };
  }
}
