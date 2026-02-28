import { injectable, inject } from "inversify";
import { IMessageRepository } from "../../domain/repositories/IMessageRepository";
import { IConversationRepository } from "../../domain/repositories/IConversationRepository";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { HttpError } from "../../interface-adapters/errors/HttpError";
import { Message } from "../../domain/entities/Message";
import { TYPES } from "../../shared/types";
import {
  ISendMessage,
  type SendMessageInput,
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
      throw new HttpError(400, "Message is required");
    if (type === "image" && (!image || !image.trim()))
      throw new HttpError(400, "Image URL is required");
    if (type === "post" && (!message || !message.trim()))
      throw new HttpError(400, "Post ID is required");

    const sender = await this.userRepository.findById(senderId);
    if (!sender) {
      throw new HttpError(404, "Sender not found");
    }

    const conversation =
      await this.conversationRepository.findById(conversationId);
    if (!conversation || !conversation.isParticipant(senderId)) {
      throw new HttpError(
        403,
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
