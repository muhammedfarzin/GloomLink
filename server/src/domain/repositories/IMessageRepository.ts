import { Message } from "../entities/Message";

export interface IMessageRepository {
  create(messageData: Message): Promise<Message>;
  findById(messageId: string): Promise<Message | null>;
  update(message: Message): Promise<Message | null>;
  findByConversationId(
    conversationId: string,
    options: { page: number; limit: number },
  ): Promise<Message[]>;
}
