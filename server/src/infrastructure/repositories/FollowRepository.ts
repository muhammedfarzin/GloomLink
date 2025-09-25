import { IFollowRepository } from "../../domain/repositories/IFollowRepository";
import { Follow } from "../../domain/entities/Follow";
import { FollowModel } from "../database/models/FollowModel";
import { FollowMapper } from "../database/mappers/FollowMapper";

export class FollowRepository implements IFollowRepository {
  async create(followerId: string, followingId: string): Promise<Follow> {
    const newFollow = new FollowModel({
      followedBy: followerId,
      followingTo: followingId,
    });
    const savedDoc = await newFollow.save();
    return FollowMapper.toDomain(savedDoc);
  }

  async findByUsers(
    followerId: string,
    followingId: string
  ): Promise<Follow | null> {
    const followDoc = await FollowModel.findOne({
      followedBy: followerId,
      followingTo: followingId,
    });
    return followDoc ? FollowMapper.toDomain(followDoc) : null;
  }

  async findFollowing(userId: string): Promise<Follow[]> {
    const followModels = await FollowModel.find({ followedBy: userId });
    return followModels.map(FollowMapper.toDomain);
  }

  async deleteById(id: string): Promise<void> {
    await FollowModel.findByIdAndDelete(id);
  }
}
