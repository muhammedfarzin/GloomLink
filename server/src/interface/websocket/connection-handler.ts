import type { Socket } from "socket.io";
import { SocketController } from "../controllers/socket.controller";
import { activeUsers } from ".";
import { CallController } from "../controllers/call.controller";

export const handleSocketConnection = async (socket: Socket) => {
  const controller = new SocketController(socket);
  const callController = new CallController(socket);

  // Handle Messages
  socket.on("send-message", controller.handleSendMessage);
  socket.on("message-seen", controller.markAsSeen)

  // Handle Calls
  socket.on("call:outgoing", callController.outgoingCall);
  socket.on("call:accepted", callController.callAccepted);
  socket.on("call:declined", callController.callDeclined);
  socket.on("call:negotiationneeded", callController.negotiationNeeded)
  socket.on("call:negotiationdone", callController.negotiationDone)
  socket.on("call:ice-candidate", callController.iceCandidate)
  socket.on("call:end", callController.endCall)

  // Handle Disconnect
  socket.on("disconnect", () => {
    activeUsers[socket.user.username].delete(socket.id);
  });
};
