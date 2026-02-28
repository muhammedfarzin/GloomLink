import { injectable, inject } from "inversify";
import { IMessageRepository } from "../../domain/repositories/IMessageRepository";
import { IConversationRepository } from "../../domain/repositories/IConversationRepository";
import { Message } from "../../domain/entities/Message";
import { HttpError } from "../../interface-adapters/errors/HttpError";
import { TYPES } from "../../shared/types";
import {
  IMarkMessageAsSeen,
  type MarkMessageAsSeenInput,
} from "../../domain/use-cases/IMarkMessageAsSeen";

@injectable()
export class MarkMessageAsSeen implements IMarkMessageAsSeen {
  constructor(
    @inject(TYPES.IMessageRepository)
    private messageRepository: IMessageRepository,
    @inject(TYPES.IConversationRepository)
    private conversationRepository: IConversationRepository,
  ) {}

  async execute(input: MarkMessageAsSeenInput): Promise<Message> {
    const { messageId, viewerId } = input;

    const message = await this.messageRepository.findById(messageId);
    if (!message) {
      throw new HttpError(404, "Message not found.");
    }

    const conversation = await this.conversationRepository.findById(
      message.getConversationId(),
    );
    if (!conversation || !conversation.isParticipant(viewerId)) {
      throw new HttpError(
        403,
        "You are not a participant of this conversation.",
      );
    }

    if (message.isSentBy(viewerId)) {
      return message;
    }

    message.updateStatus("seen");
    const updatedMessage = await this.messageRepository.update(message);
    if (!updatedMessage) {
      throw new HttpError(500, "Failed mark message as seen.");
    }

    return updatedMessage;
  }
}
