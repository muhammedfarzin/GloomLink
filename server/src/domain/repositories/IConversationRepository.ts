import type { ConversationList } from "../models/Conversation";
import type { Conversation } from "../entities/Conversation";

export interface IConversationRepository {
  create(participantIds: string[]): Promise<Conversation>;
  findById(id: string): Promise<Conversation | null>;
  findByParticipants(participantIds: string[]): Promise<Conversation | null>;
  findConversationsByUserId(userId: string): Promise<ConversationList[]>;
}
