import { injectable, inject } from "inversify";
import { Message } from "../../domain/entities/Message";
import { ValidationError } from "../../domain/errors/ValidationError";
import { ForbiddenError } from "../../domain/errors/AuthErrors";
import { UserNotFoundError } from "../../domain/errors/NotFoundErrors";
import { TYPES } from "../../shared/types";
import type { IMessageRepository } from "../../domain/repositories/IMessageRepository";
import type { IConversationRepository } from "../../domain/repositories/IConversationRepository";
import type { IUserRepository } from "../../domain/repositories/IUserRepository";
import type {
  ISendMessage,
  SendMessageInput,
} from "../../domain/use-cases/ISendMessage";

@injectable()
export class SendMessage implements ISendMessage {
  constructor(
    @inject(TYPES.IMessageRepository)
    private messageRepository: IMessageRepository,
    @inject(TYPES.IConversationRepository)
    private conversationRepository: IConversationRepository,
    @inject(TYPES.IUserRepository) private userRepository: IUserRepository,
  ) {}

  async execute(input: SendMessageInput): Promise<Message> {
    const { conversationId, senderId, message, type, image } = input;

    if (type === "text" && (!message || !message.trim()))
      throw new ValidationError("Message is required");
    if (type === "image" && (!image || !image.trim()))
      throw new ValidationError("Image URL is required");
    if (type === "post" && (!message || !message.trim()))
      throw new ValidationError("Post ID is required");

    const sender = await this.userRepository.findById(senderId);
    if (!sender) {
      throw new UserNotFoundError("Sender not found");
    }

    const conversation =
      await this.conversationRepository.findById(conversationId);
    if (!conversation || !conversation.isParticipant(senderId)) {
      throw new ForbiddenError(
        "You are not a participant of this conversation.",
      );
    }

    const messageToCreate = new Message({
      ...input,
      id: crypto.randomUUID(),
      senderUsername: sender.getUsername(),
      status: "sent",
    });
    const newMessage = await this.messageRepository.create(messageToCreate);
    newMessage.addSenderUsername(sender.getUsername());

    return newMessage;
  }
}
