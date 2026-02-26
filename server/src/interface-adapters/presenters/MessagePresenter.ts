import type { MessageResponseDto } from "../../application/dtos/MessageDto";
import type { Message } from "../../domain/entities/Message";

export class MessagePresenter {
  public static toResponse(message: Message): MessageResponseDto {
    return {
      id: message.getId(),
      conversationId: message.getConversationId(),
      senderId: message.getSenderId(),
      senderUsername: message.getSenderUsername(),
      message: message.getMessage(),
      image: message.getImage(),
      type: message.getType(),
      status: message.getStatus(),
      createdAt: message.getCreatedAt(),
      updatedAt: message.getUpdatedAt(),
    };
  }
}
