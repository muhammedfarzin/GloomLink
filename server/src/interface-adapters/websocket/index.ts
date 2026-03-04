import http from "http";
import { Server } from "socket.io";
import { handleSocketConnection } from "./connection-handler";
import { authenticateTokenForSocket } from "../middleware/socket.auth-token.middleware";
import container from "../../shared/inversify.config";
import { TYPES } from "../../shared/types";

export const setupSocket = (server: http.Server) => {
  const io = new Server(server, { cors: { origin: "*" } });

  io.use(authenticateTokenForSocket);

  io.on("connection", handleSocketConnection);

  container.bind<Server>(TYPES.SocketServer).toConstantValue(io);

  return io;
};
