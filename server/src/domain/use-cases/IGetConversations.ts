import type { ConversationList } from "../models/Conversation";
import type { UserListView } from "../models/User";

interface ConversationResponse {
  conversations: ConversationList[];
  suggested: UserListView[];
}

export interface IGetConversations {
  execute(userId: string): Promise<ConversationResponse>;
}
