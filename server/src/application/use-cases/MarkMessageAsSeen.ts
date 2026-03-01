import { injectable, inject } from "inversify";
import { Message } from "../../domain/entities/Message";
import { MessageNotFoundError } from "../../domain/errors/NotFoundErrors";
import { ForbiddenError } from "../../domain/errors/AuthErrors";
import { TYPES } from "../../shared/types";
import type { IMessageRepository } from "../../domain/repositories/IMessageRepository";
import type { IConversationRepository } from "../../domain/repositories/IConversationRepository";
import type {
  IMarkMessageAsSeen,
  MarkMessageAsSeenInput,
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
      throw new MessageNotFoundError();
    }

    const conversation = await this.conversationRepository.findById(
      message.getConversationId(),
    );
    if (!conversation || !conversation.isParticipant(viewerId)) {
      throw new ForbiddenError(
        "You are not a participant of this conversation.",
      );
    }

    if (message.isSentBy(viewerId)) {
      return message;
    }

    message.updateStatus("seen");
    const updatedMessage = await this.messageRepository.update(message);
    if (!updatedMessage) {
      throw new Error("Failed mark message as seen");
    }

    return updatedMessage;
  }
}
