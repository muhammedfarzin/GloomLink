import { injectable, inject } from "inversify";
import { IMessageRepository } from "../../domain/repositories/IMessageRepository";
import { IConversationRepository } from "../../domain/repositories/IConversationRepository";
import { Message } from "../../domain/entities/Message";
import { HttpError } from "../../infrastructure/errors/HttpError";
import { TYPES } from "../../shared/types";

export interface MarkMessageAsSeenInput {
  messageId: string;
  viewerId: string;
}

@injectable()
export class MarkMessageAsSeen {
  constructor(
    @inject(TYPES.IMessageRepository)
    private messageRepository: IMessageRepository,
    @inject(TYPES.IConversationRepository)
    private conversationRepository: IConversationRepository
  ) {}

  async execute(input: MarkMessageAsSeenInput): Promise<Message> {
    const { messageId, viewerId } = input;

    const message = await this.messageRepository.findById(messageId);
    if (!message) {
      throw new HttpError(404, "Message not found.");
    }

    const conversation = await this.conversationRepository.findById(
      message.conversation
    );
    if (!conversation || !conversation.participants.includes(viewerId)) {
      throw new HttpError(
        403,
        "You are not a participant of this conversation."
      );
    }

    if (message.from === viewerId) {
      return message;
    }

    const updatedMessage = await this.messageRepository.update(messageId, {
      status: "seen",
    });
    if (!updatedMessage) {
      throw new HttpError(500, "Failed mark message as seen.");
    }

    return updatedMessage;
  }
}
