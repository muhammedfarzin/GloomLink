import { UserListResponseDto } from "../../application/dtos/UserListResponseDto";
import { Follow } from "../entities/Follow";

export type FollowListType = "followers" | "following";

export interface IFollowRepository {
  create(followerId: string, followingId: string): Promise<Follow>;
  findByUsers(followerId: string, followingId: string): Promise<Follow | null>;
  findFollowing(userId: string): Promise<Follow[]>;
  findFollowList(
    userId: string,
    type: FollowListType,
    options: { currentUserId?: string; page: number; limit: number }
  ): Promise<UserListResponseDto[]>;
  deleteById(id: string): Promise<void>;
}
