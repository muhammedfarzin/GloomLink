import { ILikeRepository, LikeableType } from '../../domain/repositories/ILikeRepository';
import { Like } from '../../domain/entities/Like';
import { LikeModel } from '../database/models/LikeModel';
import { LikeMapper } from '../database/mappers/LikeMapper';

export class LikeRepository implements ILikeRepository {
  async findByTargetAndUser(targetId: string, userId: string, type: LikeableType): Promise<Like | null> {
    const likeModel = await LikeModel.findOne({ targetId, userId, type });
    return likeModel ? LikeMapper.toDomain(likeModel) : null;
  }

  async create(likeData: { targetId: string, userId: string, type: LikeableType }): Promise<Like> {
    const likeToPersist = LikeMapper.toPersistence(likeData);
    const newLikeModel = new LikeModel(likeToPersist);
    const savedLike = await newLikeModel.save();
    return LikeMapper.toDomain(savedLike);
  }

  async delete(id: string): Promise<void> {
    await LikeModel.findByIdAndDelete(id);
  }
}