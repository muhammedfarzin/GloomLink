import { Follow } from '../entities/Follow';

export interface IFollowRepository {
  findFollowing(userId: string): Promise<Follow[]>;
}