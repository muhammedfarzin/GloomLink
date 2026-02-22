import { injectable, inject } from "inversify";
import { IMessageRepository } from "../../domain/repositories/IMessageRepository";
import { IConversationRepository } from "../../domain/repositories/IConversationRepository";
import { Message } from "../../domain/entities/Message";
import { HttpError } from "../../infrastructure/errors/HttpError";
import { TYPES } from "../../shared/types";
import {
  IGetMessages,
  type GetMessagesInput,
} from "../../domain/use-cases/IGetMessages";

@injectable()
export class GetMessages implements IGetMessages {
  constructor(
    @inject(TYPES.IMessageRepository)
    private messageRepository: IMessageRepository,
    @inject(TYPES.IConversationRepository)
    private conversationRepository: IConversationRepository,
  ) {}

  async execute(input: GetMessagesInput): Promise<Message[]> {
    const { conversationId, currentUserId, page, limit } = input;

    const conversation =
      await this.conversationRepository.findById(conversationId);
    if (!conversation) {
      throw new HttpError(404, "Conversation not found.");
    }
    if (!conversation.isParticipant(currentUserId)) {
      throw new HttpError(
        403,
        "You are not authorized to view these messages.",
      );
    }

    return this.messageRepository.findByConversationId(conversationId, {
      page,
      limit,
    });
  }
}
