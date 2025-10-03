import { injectable, inject } from "inversify";
import { IMessageRepository } from "../../domain/repositories/IMessageRepository";
import { IConversationRepository } from "../../domain/repositories/IConversationRepository";
import { Message } from "../../domain/entities/Message";
import { HttpError } from "../../infrastructure/errors/HttpError";
import { TYPES } from "../../shared/types";

export interface GetMessagesInput {
  conversationId: string;
  currentUserId: string;
  page: number;
  limit: number;
}

@injectable()
export class GetMessages {
  constructor(
    @inject(TYPES.IMessageRepository)
    private messageRepository: IMessageRepository,
    @inject(TYPES.IConversationRepository)
    private conversationRepository: IConversationRepository
  ) {}

  async execute(input: GetMessagesInput): Promise<Message[]> {
    const { conversationId, currentUserId, page, limit } = input;

    const conversation = await this.conversationRepository.findById(
      conversationId
    );
    if (!conversation) {
      throw new HttpError(404, "Conversation not found.");
    }
    if (!conversation.participants.includes(currentUserId)) {
      throw new HttpError(
        403,
        "You are not authorized to view these messages."
      );
    }

    return this.messageRepository.findByConversationId(conversationId, {
      page,
      limit,
    });
  }
}
