import { IFollowRepository } from '../../domain/repositories/IFollowRepository';
import { Follow } from '../../domain/entities/Follow';
import { FollowModel } from '../database/models/FollowModel';
import { FollowMapper } from '../database/mappers/FollowMapper';

export class FollowRepository implements IFollowRepository {
  async findFollowing(userId: string): Promise<Follow[]> {
    const followModels = await FollowModel.find({ followedBy: userId });
    return followModels.map(FollowMapper.toDomain);
  }
}