import { Interaction } from "../entities/Interaction";

export interface IInteractionRepository {
  create(interaction: Interaction): Promise<Interaction>;
  findByUserId(userId: string, limit?: number): Promise<Interaction[]>;
  getTopInteractedTags(userId: string, limit?: number): Promise<string[]>;
  getDashboardMetrics(
    startDate: Date,
    endDate: Date,
  ): Promise<InteractionDashboardMetrics>;
}

export interface InteractionDashboardMetrics {
  totalInteractions: number;
  activeUsers: number;
  chartData: { date: string; count: number }[];
}
