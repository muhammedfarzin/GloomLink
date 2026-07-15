import { injectable, inject } from "inversify";
import { TYPES } from "@/shared/types";
import type { IGetConversations } from "@/domain/use-cases/IGetConversations";
import type { IConversationRepository } from "@/domain/repositories/IConversationRepository";

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
