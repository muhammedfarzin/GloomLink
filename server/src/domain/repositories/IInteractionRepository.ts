import { Interaction } from "../entities/Interaction";

export interface IInteractionRepository {
  create(interaction: Partial<Interaction>): Promise<Interaction>;
  findByUser(userId: string, limit?: number): Promise<Interaction[]>;
  getTopInteractedTags(userId: string, limit?: number): Promise<string[]>;
}
