import { inject, injectable } from "inversify";
import { TYPES } from "../../shared/types";
import { ValidationError } from "../../domain/errors/ValidationError";

import type { IUserRepository } from "../../domain/repositories/IUserRepository";
import type { IPostRepository } from "../../domain/repositories/IPostRepository";
import type { IInteractionRepository } from "../../domain/repositories/IInteractionRepository";
import type {
  IGetDashboardData,
  DashboardMetrics,
} from "../../domain/use-cases/IGetDashboardData";

@injectable()
export class GetDashboardData implements IGetDashboardData {
  constructor(
    @inject(TYPES.IUserRepository) private userRepository: IUserRepository,
    @inject(TYPES.IPostRepository) private postRepository: IPostRepository,
    @inject(TYPES.InteractionRepository)
    private interactionRepository: IInteractionRepository,
  ) {}

  async execute(startDate: Date, endDate: Date): Promise<DashboardMetrics> {
    if (startDate > endDate) {
      throw new ValidationError("Start date cannot be after end date");
    }

    const [userMetrics, postMetrics, interactionMetrics] = await Promise.all([
      this.userRepository.getDashboardMetrics(startDate, endDate),
      this.postRepository.getDashboardMetrics(startDate, endDate),
      this.interactionRepository.getDashboardMetrics(startDate, endDate),
    ]);

    // Generate a list for chart
    const chartData: DashboardMetrics["chartData"] = [];
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const date = currentDate.toISOString().split("T")[0];
      const u = userMetrics.chartData.find((d) => d.date === date);
      const p = postMetrics.chartData.find((d) => d.date === date);
      const i = interactionMetrics.chartData.find((d) => d.date === date);

      if (u || p || i) {
        chartData.push({
          date,
          newUsers: u ? u.count : 0,
          posts: p ? p.count : 0,
          interactions: i ? i.count : 0,
        });
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return {
      totalUsers: userMetrics.totalUsers,
      newUsers: userMetrics.newUsers,
      totalPosts: postMetrics.totalPosts,
      totalInteractions: interactionMetrics.totalInteractions,
      activeUsers: interactionMetrics.activeUsers,
      chartData,
    };
  }
}
