import type { Socket, SocketActiveUsers } from "socket.io";
import { inject, injectable } from "inversify";
import { TYPES } from "../../shared/types";

@injectable()
export class CallController {
  constructor(
    @inject(TYPES.SocketActiveUsers)
    private readonly activeUsers: SocketActiveUsers,
  ) {}

  outgoingCall = (
    socket: Socket,
    username: string,
    offer: RTCSessionDescriptionInit,
  ) => {
    const targetUserIds = this.activeUsers[username];
    if (!targetUserIds || !targetUserIds.size)
      return socket.emit("call:error", "User is not available right now");

    const targetUserSocketIds = [...targetUserIds];
    socket
      .to(targetUserSocketIds)
      .emit("call:incoming", socket.user.username, offer, socket.id);
  };

  callAccepted = (
    socket: Socket,
    _username: string,
    answer: RTCSessionDescriptionInit,
    socketId: string,
  ) => {
    socket
      .to(socketId)
      .emit("call:accepted", socket.user.username, answer, socket.id);
  };

  callDeclined = (socket: Socket, socketId: string) => {
    socket.to(socketId).emit("call:declined", socket.user.username, socket.id);
  };

  negotiationNeeded = (
    socket: Socket,
    offer: RTCSessionDescriptionInit,
    socketId: string,
  ) => {
    socket
      .to(socketId)
      .emit("call:negotiationneeded", socket.user.username, offer, socket.id);
  };

  negotiationDone = (
    socket: Socket,
    answer: RTCSessionDescriptionInit,
    socketId: string,
  ) => {
    socket
      .to(socketId)
      .emit("call:negotiationdone", socket.user.username, answer, socket.id);
  };

  iceCandidate = (
    socket: Socket,
    candidate: RTCIceCandidate,
    socketId: string,
  ) => {
    socket
      .to(socketId)
      .emit("call:ice-candidate", socket.user.username, candidate, socket.id);
  };

  endCall = (socket: Socket, socketId: string) => {
    socket.to(socketId).emit("call:end", socket.id);
  };
}
