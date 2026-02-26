import http from "http";
import { Server } from "socket.io";
import { handleSocketConnection } from "./connection-handler";
import { authenticateTokenForSocket } from "../middleware/socket.auth-token.middleware";
import container from "../../shared/inversify.config";
import { TYPES } from "../../shared/types";

export const activeUsers: Record<string, Set<string>> = {};

export const setupSocket = (server: http.Server) => {
  const io = new Server(server, { cors: { origin: "*" } });

  io.use(authenticateTokenForSocket);

  io.on("connection", handleSocketConnection);

  container.bind(TYPES.SocketActiveUsers).toConstantValue(activeUsers);
  container.bind(TYPES.SocketServer).toConstantValue(io);

  return io;
};
