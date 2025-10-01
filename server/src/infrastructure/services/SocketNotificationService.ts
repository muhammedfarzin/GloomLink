import { Server } from "socket.io";
import appEmitter from "../../application/events/appEmitter";
import { INotificationService } from "../../application/services/INotificationService";
import { Conversation } from "../../domain/entities/Conversation";
import { User } from "../../domain/entities/User";
import { ConversationMapper } from "../database/mappers/ConversationMapper";
import { activeUsers } from "../../interface/websocket";

export class SocketNotificationService implements INotificationService {
  private io: Server;

  constructor(io: Server) {
    this.io = io;
    this.listenForEvents();
  }

  private listenForEvents() {
    appEmitter.on("conversationCreated", this.handleConversationCreated);
  }

  public handleConversationCreated = (data: {
    conversation: Conversation;
    creator: User;
    otherParticipants: User[];
  }) => {
    const { conversation, creator, otherParticipants } = data;
    const otherPartyUsername = otherParticipants
      .map((u) => u.username)
      .join(", ");

    const viewForCreator = ConversationMapper.toListView({
      username: otherParticipants.map((u) => u.username).join(", "),
      conversationId: conversation._id,
      lastMessageTime: new Date(),
    });
    const viewForOthers = ConversationMapper.toListView({
      username: creator.username,
      conversationId: conversation._id,
      lastMessageTime: new Date(),
    });

    // Emit to the creator
    const creatorSockets = activeUsers[creator.username];
    if (creatorSockets) {
      creatorSockets.forEach((socketId) => {
        this.io.sockets.sockets.get(socketId)?.join(conversation._id);
        this.io.to(socketId).emit("new-conversation", viewForCreator);
      });
    }

    // Emit to other participants
    otherParticipants.forEach((participant) => {
      const participantSockets = activeUsers[participant.username];
      if (participantSockets) {
        participantSockets.forEach((socketId) => {
          this.io.sockets.sockets.get(socketId)?.join(conversation._id);
          this.io.to(socketId).emit("new-conversation", viewForOthers);
        });
      }
    });
  };
}
