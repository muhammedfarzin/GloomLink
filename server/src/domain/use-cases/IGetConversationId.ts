import { Conversation } from "../entities/Conversation";

export interface IGetConversationId {
  execute(input: GetConversationIdInput): Promise<Conversation>;
}

export interface GetConversationIdInput {
  participantsUsername: string[];
}
