import { UserListResponseDto } from "../../application/dtos/UserListResponseDto";
import { UserProfileResponseDto } from "../../application/dtos/UserProfileResponseDto";
import { User } from "../entities/User";
import { EnrichedPost } from "./IPostRepository";

export interface IUserRepository {
  create: (data: Partial<User>) => Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findByUsername(username: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  findByIdentifier(identifier: string): Promise<User | null>;
  checkUserExist: (
    query: Pick<User, "username" | "email" | "mobile">
  ) => Promise<{ exist: false } | { exist: true; data: User; field: string }>;
  update(id: string, userData: Partial<User>): Promise<User | null>;
  findSavedPosts(
    userId: string,
    page: number,
    limit: number
  ): Promise<EnrichedPost[]>;
  savePost(userId: string, postId: string): Promise<void>;
  unsavePost(userId: string, postId: string): Promise<void>;
  findProfileByUsername(
    username: string,
    currentUserId: string,
    limit?: number
  ): Promise<UserProfileResponseDto | null>;
  findByStatus(
    status: "active" | "blocked" | "inactive",
    options: {
      userId?: string;
      searchQuery?: string;
      page: number;
      limit: number;
    }
  ): Promise<UserListResponseDto[]>;
  findAll(options: {
    filter: "all" | "active" | "blocked";
    searchQuery?: string;
    page: number;
    limit: number;
  }): Promise<User[]>;
  findSuggestions(
    userId: string,
    excludeIds: string[],
    limit: number
  ): Promise<UserListResponseDto[]>;
}
