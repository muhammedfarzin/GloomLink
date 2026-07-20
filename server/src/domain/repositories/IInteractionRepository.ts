import type { Interaction } from "../entities/Interaction";
import type { IRepository } from "./IRepository";

export interface IInteractionRepository extends IRepository {
  create(interaction: Interaction): Promise<Interaction>;
  findById(id: string): Promise<Interaction | null>;
  findByUserId(userId: string, limit?: number): Promise<Interaction[]>;
  getTopInteractedTags(userId: string, limit?: number): Promise<string[]>;
  getDashboardMetrics(
    startDate: Date,
    endDate: Date,
  ): Promise<InteractionDashboardMetrics>;
  update(data: Interaction): Promise<Interaction | null>;
  deleteById(id: string): Promise<Interaction | null>;
}

export interface InteractionDashboardMetrics {
  totalInteractions: number;
  activeUsers: number;
  chartData: { date: string; count: number }[];
}
