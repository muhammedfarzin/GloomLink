import { injectable, inject } from "inversify";
import { Conversation } from "../../domain/entities/Conversation";
import { ConversationNotFoundError } from "../../domain/errors/NotFoundErrors";
import { ValidationError } from "../../domain/errors/ValidationError";
import { TYPES } from "../../shared/types";
import type { IConversationRepository } from "../../domain/repositories/IConversationRepository";
import type { IUserRepository } from "../../domain/repositories/IUserRepository";
import type {
  IGetConversation,
  GetConversationIdInput,
} from "../../domain/use-cases/IGetConversation";

@injectable()
export class GetConversation implements IGetConversation {
  constructor(
    @inject(TYPES.IConversationRepository)
    private conversationRepository: IConversationRepository,
    @inject(TYPES.IUserRepository) private userRepository: IUserRepository,
  ) {}

  async execute(input: GetConversationIdInput): Promise<Conversation> {
    const { participantsUsername } = input;

    if (participantsUsername.length <= 1) {
      throw new ValidationError("Conversation needs atleast 2 participants");
    }

    const participantsData = await Promise.all(
      participantsUsername.map((username) =>
        this.userRepository.findByUsername(username),
      ),
    );

    const participantsId = participantsData
      .filter((user) => !!user)
      .map((user) => user.getId());

    if (participantsId.length !== participantsUsername.length) {
      throw new ConversationNotFoundError();
    }

    const conversation =
      await this.conversationRepository.findByParticipants(participantsId);

    if (!conversation) {
      throw new ConversationNotFoundError();
    }

    return conversation;
  }
}
