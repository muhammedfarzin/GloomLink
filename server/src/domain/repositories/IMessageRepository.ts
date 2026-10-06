import { Message } from "../entities/Message";
import { IBaseRepository } from "./IBaseRepository";

export interface IMessageRepository extends IBaseRepository<Message> {
  create(messageData: Message): Promise<Message>;
  findById(messageId: string): Promise<Message | null>;
  update(message: Message): Promise<Message | null>;
  findByConversationId(
    conversationId: string,
    options: { page: number; limit: number },
  ): Promise<Message[]>;
  deleteById(id: string): Promise<Message | null>;
}
