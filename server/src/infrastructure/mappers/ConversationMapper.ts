import { Conversation } from "../../domain/entities/Conversation";
import type { ConversationType } from "../../domain/models/Conversation";
import type { ConversationListDto } from "../../application/dtos/ConversationListDto";

export class ConversationMapper {
  public static toDomain(conversation: ConversationType): Conversation {
    return new Conversation({
      conversationId: conversation.conversationId,
      participants: conversation.participants,
    });
  }

  public static toPersistence(conversation: Conversation): ConversationType {
    return {
      conversationId: conversation.getConversationId(),
      participants: conversation.getParticipants(),
    };
  }

  public static toListView(conversation: any): ConversationListDto {
    return {
      participantId: conversation.participantId?.toString(),
      conversationId: conversation.conversationId?.toString(),
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
