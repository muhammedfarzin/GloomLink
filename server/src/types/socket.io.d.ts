import { Socket } from "socket.io";

declare module "socket.io" {
  interface Socket {
    user: {
      role: "user";
      _id: string;
      firstname: string;
      lastname: string;
      username: string;
      email: string;
      authType: "email" | "google";
      status: "active" | "inactive" | "blocked" | "not-verified";
    } | {
      _id: string;
      role: "admin";
      username: string;
    };
  }
}
