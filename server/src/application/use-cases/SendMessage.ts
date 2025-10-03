import { injectable, inject } from "inversify";
import { IMessageRepository } from "../../domain/repositories/IMessageRepository";
import { IConversationRepository } from "../../domain/repositories/IConversationRepository";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { HttpError } from "../../infrastructure/errors/HttpError";
import { Message } from "../../domain/entities/Message";
import { TYPES } from "../../shared/types";

export interface SendMessageInput {
  conversationId: string;
  senderId: string;
  message?: string;
  type: "text" | "image" | "post";
  image?: string;
}

@injectable()
export class SendMessage {
  constructor(
    @inject(TYPES.IMessageRepository)
    private messageRepository: IMessageRepository,
    @inject(TYPES.IConversationRepository)
    private conversationRepository: IConversationRepository,
    @inject(TYPES.IUserRepository) private userRepository: IUserRepository
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

    const conversation = await this.conversationRepository.findById(
      conversationId
    );
    if (!conversation || !conversation.participants.includes(senderId)) {
      throw new HttpError(
        403,
        "You are not a participant of this conversation."
      );
    }

    const newMessage = await this.messageRepository.create({
      conversation: conversationId,
      from: senderId,
      message,
      type,
      image,
      status: "sent",
    });

    return { ...newMessage, from: sender.username };
  }
}
