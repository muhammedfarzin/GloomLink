import { Conversation } from "@/domain/entities/Conversation";
import type {
  ConversationType,
  ConversationList,
} from "@/domain/models/Conversation";
import type { ConversationDocument } from "../database/models/ConversationModel";

export class ConversationMapper {
  public static toDomain(
    conversation: ConversationType | ConversationDocument,
  ): Conversation {
    return new Conversation({
      id: conversation.id,
      participants: conversation.participants.map((p) => p.toString()),
    });
  }

  public static toPersistence(conversation: Conversation): ConversationType {
    return {
      id: conversation.getId(),
      participants: conversation.getParticipants(),
    };
  }

  public static toResponse(conversation: any): ConversationList {
    return {
      id: conversation.id?.toString(),
      participantId: conversation.participantId?.toString(),
      username: conversation.username,
      firstname: conversation.firstname,
      lastname: conversation.lastname,
      imageUrl: conversation.imageUrl,
      unread: conversation.unread || 0,
      lastMessageTime: conversation.lastMessageTime,
      type: "conversation",
    };
  }
}
