import { injectable, inject } from "inversify";
import { Conversation } from "../../domain/entities/Conversation";
import { HttpError } from "../../interface-adapters/errors/HttpError";
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
      throw new HttpError(404, "Conversation needs atleast 2 participants");
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
      throw new HttpError(404, "Conversation not found");
    }

    const conversation =
      await this.conversationRepository.findByParticipants(participantsId);

    if (!conversation) {
      throw new HttpError(404, "Conversation not found");
    }

    return conversation;
  }
}
