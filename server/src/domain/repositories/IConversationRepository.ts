import { ConversationListDto } from "../../application/dtos/ConversationListDto";

export interface IConversationRepository {
  findConversationsByUserId(userId: string): Promise<ConversationListDto[]>;
}
