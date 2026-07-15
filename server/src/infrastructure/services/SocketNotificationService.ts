import { inject } from "inversify";
import type { Server } from "socket.io";
import { ConversationMapper } from "../mappers/ConversationMapper";
import type { INotificationService } from "@/domain/services/INotificationService";
import type { Conversation } from "@/domain/entities/Conversation";
import type { User } from "@/domain/entities/User";
import { TYPES } from "@/shared/types";

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

    const rawConversationResponse = {
      id: conversation.getId(),
      participantId: conversation.getParticipants(),
      lastMessageTime: new Date(),
    };

    const viewForCreator = ConversationMapper.toResponse({
      ...rawConversationResponse,
      username: otherParticipants.map((u) => u.getUsername()).join(", "),
    });
    const viewForOthers = ConversationMapper.toResponse({
      ...rawConversationResponse,
      username: creator.getUsername(),
    });

    // Emit to the creator
    const creatorSockets = this.activeUsers[creator.getUsername()];
    if (creatorSockets) {
      creatorSockets.forEach((socketId) => {
        this.io.sockets.sockets.get(socketId)?.join(conversation.getId());
        this.io.to(socketId).emit("new-conversation", viewForCreator);
      });
    }

    // Emit to other participants
    otherParticipants.forEach((participant) => {
      const participantSockets = this.activeUsers[participant.getUsername()];
      if (participantSockets) {
        participantSockets.forEach((socketId) => {
          this.io.sockets.sockets.get(socketId)?.join(conversation.getId());
          this.io.to(socketId).emit("new-conversation", viewForOthers);
        });
      }
    });
  };
}
