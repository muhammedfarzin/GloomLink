import { injectable, inject } from "inversify";
import { IConversationRepository } from "../../domain/repositories/IConversationRepository";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { Conversation } from "../../domain/entities/Conversation";
import { HttpError } from "../../infrastructure/errors/HttpError";
import { TYPES } from "../../shared/types";

export interface GetConversationIdInput {
  participantsUsername: string[];
}

@injectable()
export class GetConversationId {
  constructor(
    @inject(TYPES.IConversationRepository)
    private conversationRepository: IConversationRepository,
    @inject(TYPES.IUserRepository) private userRepository: IUserRepository
  ) {}

  async execute(input: GetConversationIdInput): Promise<Conversation> {
    const { participantsUsername } = input;

    if (participantsUsername.length <= 1) {
      throw new HttpError(404, "Conversation needs atleast 2 participants");
    }

    const participantsData = await Promise.all(
      participantsUsername.map((username) =>
        this.userRepository.findByUsername(username)
      )
    );

    const participantsId = participantsData
      .filter((user) => !!user)
      .map((user) => user._id);

    if (participantsId.length !== participantsUsername.length) {
      throw new HttpError(404, "Conversation not found");
    }

    const conversation = await this.conversationRepository.findByParticipants(
      participantsId
    );

    if (!conversation) {
      throw new HttpError(404, "Conversation not found");
    }

    return conversation;
  }
}
