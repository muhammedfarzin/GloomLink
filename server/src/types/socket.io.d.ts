import type { Socket } from "socket.io";
import type { AuthUser } from "./user";

declare module "socket.io" {
  interface Socket {
    user: AuthUser | { role: "admin"; id: string; username: string };
  }
}
