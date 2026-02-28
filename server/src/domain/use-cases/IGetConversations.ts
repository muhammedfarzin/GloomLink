import type { ConversationList } from "../models/Conversation";

export interface IGetConversations {
  execute(userId: string): Promise<ConversationList[]>;
}
