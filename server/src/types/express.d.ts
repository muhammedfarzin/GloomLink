import { Request } from "express";
import { User } from "../infrastructure/database/models/UserModel";
import { TokenPayloadType } from "../application/services/token.service";

declare module "express-serve-static-core" {
  interface Request {
    user?:
      | { role: "admin"; username: string }
      | {
          role: "temp";
          firstname: string;
          lastname: string;
          username: string;
          email: string;
          mobile: string;
          status: string;
        }
      | {
          role: "user";
          _id: string;
          firstname: string;
          lastname: string;
          username: string;
          email: string;
          mobile: string;
          status: string;
        };
  }
}
