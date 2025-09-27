import { Socket } from "socket.io";

declare module "socket.io" {
  interface Socket {
    user:
      | { role: "admin"; id: string; username: string }
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
