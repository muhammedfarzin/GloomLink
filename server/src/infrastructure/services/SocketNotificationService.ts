import { Server } from "socket.io";
import type { INotificationService } from "../../domain/services/INotificationService";
import type { Conversation } from "../../domain/entities/Conversation";
import type { User } from "../../domain/entities/User";
import { ConversationMapper } from "../mappers/ConversationMapper";
import { inject } from "inversify";
import { TYPES } from "../../shared/types";

export class SocketNotificationService implements INotificationService {
  constructor(
    @inject(TYPES.SocketServer) private readonly io: Server,
    @inject(TYPES.SocketActiveUsers)
    private readonly activeUsers: Record<string, Set<string>>,
  ) {}

  public notifyConversationCreated = (data: {
    conversation: Conversation;
    creator: User;
    otherParticipants: User[];
  }) => {
    const { conversation, creator, otherParticipants } = data;

    const viewForCreator = ConversationMapper.toListView({
      username: otherParticipants.map((u) => u.getUsername()).join(", "),
      conversationId: conversation.getConversationId(),
      lastMessageTime: new Date(),
    });
    const viewForOthers = ConversationMapper.toListView({
      username: creator.getUsername(),
      conversationId: conversation.getConversationId(),
      lastMessageTime: new Date(),
    });

    // Emit to the creator
    const creatorSockets = this.activeUsers[creator.getUsername()];
    if (creatorSockets) {
      creatorSockets.forEach((socketId) => {
        this.io.sockets.sockets
          .get(socketId)
          ?.join(conversation.getConversationId());
        this.io.to(socketId).emit("new-conversation", viewForCreator);
      });
    }

    // Emit to other participants
    otherParticipants.forEach((participant) => {
      const participantSockets = this.activeUsers[participant.getUsername()];
      if (participantSockets) {
        participantSockets.forEach((socketId) => {
          this.io.sockets.sockets
            .get(socketId)
            ?.join(conversation.getConversationId());
          this.io.to(socketId).emit("new-conversation", viewForOthers);
        });
      }
    });
  };
}
