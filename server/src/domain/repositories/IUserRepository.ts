import type { User } from "../entities/User";
import type { EnrichedPost } from "./IPostRepository";
import type {
  UserListViewDto,
  UserProfileResponseDto,
} from "../../application/dtos/UserDto";
import type { UserCompactProfile } from "../models/UserCompactProfile";

export interface IUserRepository {
  create: (user: User) => Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findByUsername(username: string): Promise<User | null>;
  findById(userId: string): Promise<User | null>;
  findByIdentifier(identifier: string): Promise<User | null>;
  checkUserExist: (
    query: UserIdentifier,
  ) => Promise<
    { isExists: false } | { isExists: true; data: User; field: string }
  >;
  update(id: string, userData: User): Promise<User | null>;
  findSavedPosts(
    userId: string,
    page: number,
    limit: number,
  ): Promise<EnrichedPost[]>;
  savePost(userId: string, postId: string): Promise<void>;
  unsavePost(userId: string, postId: string): Promise<void>;
  findProfileByUsername(
    username: string,
    currentUserId: string,
    limit?: number,
  ): Promise<UserProfileResponseDto | null>;
  findByStatus(
    status: UserStatus,
    options: UserOptions,
  ): Promise<UserListViewDto[]>;
  findAll(options: {
    filter: "all" | "active" | "blocked";
    searchQuery?: string;
    page: number;
    limit: number;
  }): Promise<User[]>;
  findSuggestions(
    userId: string,
    excludeIds: string[],
    limit: number,
  ): Promise<UserListViewDto[]>;
}

export type UserStatus = "active" | "blocked" | "inactive";
export interface UserIdentifier {
  username: string;
  email: string;
  mobile: string;
}

export interface UserOptions {
  userId?: string;
  searchQuery?: string;
  page: number;
  limit: number;
}
