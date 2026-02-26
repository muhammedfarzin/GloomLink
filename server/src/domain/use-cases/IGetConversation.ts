import { Conversation } from "../entities/Conversation";

export interface IGetConversation {
  execute(input: GetConversationIdInput): Promise<Conversation>;
}

export interface GetConversationIdInput {
  participantsUsername: string[];
}
