export interface DashboardMetrics {
  totalUsers: number;
  newUsers: number;
  activeUsers: number;
  totalPosts: number;
  totalInteractions: number;
  chartData: {
    date: string;
    newUsers: number;
    interactions: number;
    posts: number;
  }[];
}

export interface IGetDashboardData {
  execute(startDate: Date, endDate: Date): Promise<DashboardMetrics>;
}
