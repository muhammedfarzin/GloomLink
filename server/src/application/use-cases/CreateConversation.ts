import { injectable, inject } from "inversify";
import { IConversationRepository } from "../../domain/repositories/IConversationRepository";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { HttpError } from "../../interface-adapters/errors/HttpError";
import { Conversation } from "../../domain/entities/Conversation";
import { TYPES } from "../../shared/types";
import type { INotificationService } from "../../domain/services/INotificationService";
import {
  ICreateConversation,
  type CreateConversationInput,
} from "../../domain/use-cases/ICreateConversation";

@injectable()
export class CreateConversation implements ICreateConversation {
  constructor(
    @inject(TYPES.IConversationRepository)
    private conversationRepository: IConversationRepository,
    @inject(TYPES.IUserRepository) private userRepository: IUserRepository,
    @inject(TYPES.INotificationService)
    private notificationService: INotificationService,
  ) {}

  async execute(input: CreateConversationInput): Promise<Conversation> {
    input.participantsUsername = input.participantsUsername.filter(
      (username) => username !== input.currentUsername,
    );

    const { currentUsername, participantsUsername } = input;

    if (participantsUsername.length === 0) {
      throw new HttpError(
        400,
        "You cannot create a conversation without other users",
      );
    }

    const pUsernames = [currentUsername, ...participantsUsername];
    const users = (
      await Promise.all(
        pUsernames.map((username) =>
          this.userRepository.findByUsername(username),
        ),
      )
    ).filter((user) => !!user);

    const participantsIds = users.map((user) => user.getId());

    if (participantsIds.length !== pUsernames.length) {
      throw new HttpError(
        404,
        "the user you are tryinng to message not found or has been removed",
      );
    }

    const currentUser = users.find(
      (user) => user.getUsername() === currentUsername,
    );
    if (!currentUser) {
      throw new HttpError(400, "You cannot create a conversation without you");
    }

    // ---Check if a conversation already exists---
    const existingConversation =
      await this.conversationRepository.findByParticipants(participantsIds);
    if (existingConversation) {
      return existingConversation;
    }

    // ---If not, create a new one---
    const newConversation =
      await this.conversationRepository.create(participantsIds);

    // Inform to all participants
    this.notificationService.notifyConversationCreated({
      conversation: newConversation,
      creator: currentUser,
      otherParticipants: users.filter(
        (user) => user.getUsername() !== currentUsername,
      ),
    });

    return newConversation;
  }
}
