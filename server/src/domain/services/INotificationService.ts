import type { Conversation } from "../entities/Conversation";
import type { User } from "../entities/User";

export interface INotificationService {
  notifyConversationCreated(data: {
    conversation: Conversation;
    creator: User;
    otherParticipants: User[];
  }): void;
}
