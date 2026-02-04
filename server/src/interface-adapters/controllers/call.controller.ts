import type { Socket } from "socket.io";
import { activeUsers } from "../websocket";

export class CallController {
  socket: Socket;
  username: string;

  constructor(socket: Socket) {
    this.socket = socket;
    this.username = socket.user.username;
  }

  outgoingCall = (username: string, offer: RTCSessionDescriptionInit) => {
    const targetUserIds = activeUsers[username];
    if (!targetUserIds || !targetUserIds.size)
      return this.socket.emit("call:error", "User is not available right now");

    const targetUserSocketIds = [...targetUserIds];
    this.socket
      .to(targetUserSocketIds)
      .emit("call:incoming", this.username, offer, this.socket.id);
  };

  callAccepted = (
    _username: string,
    answer: RTCSessionDescriptionInit,
    socketId: string
  ) => {
    this.socket
      .to(socketId)
      .emit("call:accepted", this.username, answer, this.socket.id);
  };

  callDeclined = (socketId: string) => {
    this.socket
      .to(socketId)
      .emit("call:declined", this.username, this.socket.id);
  };

  negotiationNeeded = (offer: RTCSessionDescriptionInit, socketId: string) => {
    this.socket
      .to(socketId)
      .emit("call:negotiationneeded", this.username, offer, this.socket.id);
  };

  negotiationDone = (answer: RTCSessionDescriptionInit, socketId: string) => {
    this.socket
      .to(socketId)
      .emit("call:negotiationdone", this.username, answer, this.socket.id);
  };

  iceCandidate = (candidate: RTCIceCandidate, socketId: string) => {
    this.socket
      .to(socketId)
      .emit("call:ice-candidate", this.username, candidate, this.socket.id);
  };

  endCall = (socketId: string) => {
    this.socket.to(socketId).emit("call:end", this.socket.id);
  };
}
