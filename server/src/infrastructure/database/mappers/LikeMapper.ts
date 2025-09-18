import { Types } from "mongoose";
import { Like } from "../../../domain/entities/Like";
import { LikeDocument } from "../models/LikeModel";

export class LikeMapper {
  public static toDomain(likeModel: LikeDocument): Like {
    const likeObject = likeModel.toObject<LikeDocument>();

    return {
      ...likeObject,
      _id: likeObject._id.toString(),
      targetId: likeObject.targetId.toString(),
      userId: likeObject.userId.toString(),
    };
  }

  public static toPersistence(like: Partial<Like>): any {
    const persistenceLike: any = { ...like };

    if (like._id) {
      persistenceLike._id = new Types.ObjectId(like._id);
    }
    if (like.targetId) {
      persistenceLike.targetId = new Types.ObjectId(like.targetId);
    }
    if (like.userId) {
      persistenceLike.userId = new Types.ObjectId(like.userId);
    }

    return persistenceLike;
  }
}
