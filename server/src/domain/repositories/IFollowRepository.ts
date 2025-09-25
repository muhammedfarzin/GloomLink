import { Follow } from "../entities/Follow";

export interface IFollowRepository {
  create(followerId: string, followingId: string): Promise<Follow>;
  findByUsers(followerId: string, followingId: string): Promise<Follow | null>;
  findFollowing(userId: string): Promise<Follow[]>;
  deleteById(id: string): Promise<void>;
}
