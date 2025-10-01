import http from "http";
import { Server } from "socket.io";
import { handleSocketConnection } from "./connection-handler";
import { authenticateTokenForSocket } from "../middleware/socket.auth-token.middleware";
import { SocketNotificationService } from "../../infrastructure/services/SocketNotificationService";

export const activeUsers: Record<string, Set<string>> = {};

export const setupSocket = (server: http.Server) => {
  const io = new Server(server, { cors: { origin: "*" } });

  io.use(authenticateTokenForSocket);

  io.on("connection", handleSocketConnection);

  new SocketNotificationService(io);
};
