import { Message } from "../entities/Message";

export interface IMessageRepository {
  findByConversationId(
    conversationId: string,
    options: { page: number; limit: number }
  ): Promise<Message[]>;
}
