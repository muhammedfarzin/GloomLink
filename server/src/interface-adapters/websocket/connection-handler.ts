import type { Socket, SocketActiveUsers } from "socket.io";
import type { SocketController } from "../controllers/socket.controller";
import type { CallController } from "../controllers/call.controller";
import container from "../../shared/inversify.config";
import { TYPES } from "../../shared/types";

export const handleSocketConnection = async (socket: Socket) => {
  const controller = container.get<SocketController>(TYPES.SocketController);
  const callController = container.get<CallController>(TYPES.CallController);
  const activeUsers = container.get<SocketActiveUsers>(TYPES.SocketActiveUsers);

  // Handle Messages
  socket.on("send-message", (conversationId, data) =>
    controller.handleSendMessage(socket, conversationId, data),
  );
  socket.on("message-seen", (...args) =>
    controller.markAsSeen(socket, ...args),
  );

  // Handle Calls
  socket.on("call:outgoing", (username, offer) =>
    callController.outgoingCall(socket, username, offer),
  );
  socket.on("call:accepted", (username, answer, socketId) =>
    callController.callAccepted(socket, username, answer, socketId),
  );
  socket.on("call:declined", (socketId) =>
    callController.callDeclined(socket, socketId),
  );
  socket.on("call:negotiationneeded", (offer, socketId) =>
    callController.negotiationNeeded(socket, offer, socketId),
  );
  socket.on("call:negotiationdone", (answer, socketId) =>
    callController.negotiationDone(socket, answer, socketId),
  );
  socket.on("call:ice-candidate", (candidate, socketId) =>
    callController.iceCandidate(socket, candidate, socketId),
  );
  socket.on("call:end", (socketId) => callController.endCall(socket, socketId));

  // Handle Disconnect
  socket.on("disconnect", () => {
    activeUsers[socket.user.username].delete(socket.id);
  });
};
