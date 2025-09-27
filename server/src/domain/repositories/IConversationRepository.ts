import { ConversationListDto } from "../../application/dtos/ConversationListDto";
import { Conversation } from "../entities/Conversation";

export interface IConversationRepository {
  create(participantIds: string[]): Promise<Conversation>;
  findByParticipants(participantIds: string[]): Promise<Conversation | null>;
  findConversationsByUserId(userId: string): Promise<ConversationListDto[]>;
}
