import type { Socket } from "socket.io";
import { SocketController } from "../controllers/socket.controller";
import { activeUsers } from ".";

export const handleSocketConnection = async (socket: Socket) => {
  const controller = new SocketController(socket);

  socket.on("send-message", controller.handleSendMessage);

  socket.on("disconnect", () => {
    activeUsers[socket.user.username].delete(socket.id);
  });
};
