import type { Request } from "express";
import type { AuthUser } from "./user";

declare module "express-serve-static-core" {
  interface Request {
    user?: AuthUser | { role: "admin"; id: string };
  }
}
