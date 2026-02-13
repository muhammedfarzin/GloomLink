import { Message } from "../entities/Message";

export interface IGetMessages {
  execute(input: GetMessagesInput): Promise<Message[]>;
}

export interface GetMessagesInput {
  conversationId: string;
  currentUserId: string;
  page: number;
  limit: number;
}
