import { Conversation } from "../../domain/entities/Conversation";
import { User } from "../../domain/entities/User";

export interface INotificationService {
  handleConversationCreated(data: {
    conversation: Conversation;
    creator: User;
    otherParticipants: User[];
  }): void;
}
