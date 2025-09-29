import { Message } from "../entities/Message";

export interface IMessageRepository {
  create(messageData: Partial<Message>): Promise<Message>;
  findById(messageId: string): Promise<Message | null>;
  update(messageId: string, data: Partial<Message>): Promise<Message | null>;
  findByConversationId(
    conversationId: string,
    options: { page: number; limit: number }
  ): Promise<Message[]>;
}
