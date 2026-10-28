import type { User } from "../entities/User";
import type { UserCompact } from "../models/User";
import type { UserProfile } from "../models/User";
import type { IBaseRepository } from "./IBaseRepository";

export interface IUserRepository extends IBaseRepository<User> {
  create: (user: User) => Promise<User>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findByUsername(username: string): Promise<User | null>;
  findByIdentifier(identifier: string): Promise<User | null>;
  checkUserExist: (
    query: UserIdentifier,
  ) => Promise<
    { isExists: false } | { isExists: true; data: User; field: string }
  >;
  findProfileByUsername(
    username: string,
    currentUserId: string,
    limit?: number,
  ): Promise<UserProfile | null>;
  findAll(options: UserFindOptions): Promise<User[]>;
  findSuggestions(input: SuggestionInput): Promise<UserCompact[]>;
  getDashboardMetrics(
    startDate: Date,
    endDate: Date,
  ): Promise<UserDashboardMetrics>;
  update(userData: User): Promise<User | null>;
  deleteById(id: string): Promise<User | null>;
}

export interface UserIdentifier {
  username: string;
  email: string;
  mobile: string;
}

export interface SuggestionInput {
  userId: string;
  excludeIds: string[];
  limit: number;
}

export interface UserDashboardMetrics {
  totalUsers: number;
  newUsers: number;
  chartData: { date: string; count: number }[];
}

export interface UserFindOptions {
  currUserId?: string;
  filter: "all" | "active" | "blocked";
  searchQuery?: string;
  page: number;
  limit: number;
  searchWithPersonalInfo?: boolean;
}

