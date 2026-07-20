import { Message } from "../entities/Message";
import { IRepository } from "./IRepository";

export interface IMessageRepository extends IRepository {
  create(messageData: Message): Promise<Message>;
  findById(messageId: string): Promise<Message | null>;
  update(message: Message): Promise<Message | null>;
  findByConversationId(
    conversationId: string,
    options: { page: number; limit: number },
  ): Promise<Message[]>;
  deleteById(id: string): Promise<Message | null>;
}
