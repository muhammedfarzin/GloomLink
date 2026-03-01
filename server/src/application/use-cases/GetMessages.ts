import { injectable, inject } from "inversify";
import { Message } from "../../domain/entities/Message";
import { ConversationNotFoundError } from "../../domain/errors/NotFoundErrors";
import { ForbiddenError } from "../../domain/errors/AuthErrors";
import { TYPES } from "../../shared/types";
import type { IMessageRepository } from "../../domain/repositories/IMessageRepository";
import type { IConversationRepository } from "../../domain/repositories/IConversationRepository";
import type {
  IGetMessages,
  GetMessagesInput,
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
      throw new ConversationNotFoundError();
    }
    if (!conversation.isParticipant(currentUserId)) {
      throw new ForbiddenError("You are not authorized to view these messages");
    }

    return this.messageRepository.findByConversationId(conversationId, {
      page,
      limit,
    });
  }
}
