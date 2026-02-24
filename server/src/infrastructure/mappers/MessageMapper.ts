import { Message } from "../../domain/entities/Message";
import type { MessageDocument } from "../database/models/MessageModel";
import type { CompactMessage } from "../../domain/models/Message";

export class MessageMapper {
  public static toDomain(
    message: CompactMessage | (MessageDocument & { senderUsername?: string }),
  ): Message {
    return new Message({
      id: message.id.toString(),
      conversationId: message.conversationId.toString(),
      message: message.message,
      image: message.image,
      senderId: message.senderId.toString(),
      senderUsername: message.senderUsername,
      status: message.status,
      type: message.type,
      createdAt: message.createdAt,
      updatedAt: message.updatedAt,
    });
  }

  public static toPersistence(message: Message): CompactMessage {
    return {
      id: message.getId(),
      conversationId: message.getConversationId(),
      message: message.getMessage(),
      image: message.getImage(),
      senderId: message.getSenderId(),
      senderUsername: message.getSenderUsername(),
      status: message.getStatus(),
      type: message.getType(),
      createdAt: message.getCreatedAt(),
      updatedAt: message.getUpdatedAt(),
    };
  }
}
