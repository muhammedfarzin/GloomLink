import { injectable, inject } from "inversify";
import { TYPES } from "../../shared/types";
import type { IGetConversations } from "../../domain/use-cases/IGetConversations";
import type { IConversationRepository } from "../../domain/repositories/IConversationRepository";
import type { IUserRepository } from "../../domain/repositories/IUserRepository";
import type { UserListView } from "../../domain/models/User";

const CONVERSATION_SUGGESTION_THRESHOLD = 10;

@injectable()
export class GetConversations implements IGetConversations {
  constructor(
    @inject(TYPES.IConversationRepository)
    private conversationRepository: IConversationRepository,
    @inject(TYPES.IUserRepository) private userRepository: IUserRepository,
  ) {}

  async execute(userId: string) {
    const conversations =
      await this.conversationRepository.findConversationsByUserId(userId);

    let suggested: UserListView[] = [];
    if (conversations.length < CONVERSATION_SUGGESTION_THRESHOLD) {
      const existingParticipantIds = conversations.map((c) => c.participantId);
      suggested = await this.userRepository.findSuggestions(
        userId,
        existingParticipantIds,
        5,
      );
    }
    return { conversations, suggested };
  }
}
