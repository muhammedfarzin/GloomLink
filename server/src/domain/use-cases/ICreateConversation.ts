import { Conversation } from "../entities/Conversation";

export interface ICreateConversation {
  execute(input: CreateConversationInput): Promise<Conversation>;
}

export interface CreateConversationInput {
  currentUsername: string;
  participantsUsername: string[];
}
