import { ConversationListDto } from "../../application/dtos/ConversationListDto";
import { UserListViewDto } from "../../application/dtos/UserDto";

interface ConversationResponse {
  conversations: ConversationListDto[];
  suggested: UserListViewDto[];
}

export interface IGetConversations {
  execute(userId: string): Promise<ConversationResponse>;
}
