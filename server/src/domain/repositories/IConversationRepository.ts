import type { ConversationList } from "../models/Conversation";
import type { Conversation } from "../entities/Conversation";
import type { IRepository } from "./IRepository";

export interface IConversationRepository extends IRepository {
  create(data: Conversation): Promise<Conversation>;
  findById(id: string): Promise<Conversation | null>;
  findByParticipants(participantIds: string[]): Promise<Conversation | null>;
  findConversationsByUserId(userId: string): Promise<ConversationList[]>;
  update(data: Conversation): Promise<Conversation | null>;
  deleteById(id: string): Promise<Conversation | null>;
}
