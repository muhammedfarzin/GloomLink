import { injectable, inject } from "inversify";
import { TYPES } from "../../shared/types";
import type { IGetConversations } from "../../domain/use-cases/IGetConversations";
import type { IConversationRepository } from "../../domain/repositories/IConversationRepository";

const CONVERSATION_SUGGESTION_THRESHOLD = 10;

@injectable()
export class GetConversations implements IGetConversations {
  constructor(
    @inject(TYPES.IConversationRepository)
    private conversationRepository: IConversationRepository,
  ) {}

  execute(userId: string) {
    return this.conversationRepository.findConversationsByUserId(userId);
  }
}
