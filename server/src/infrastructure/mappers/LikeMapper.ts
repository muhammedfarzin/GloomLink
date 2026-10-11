import { Mapper } from "./Mapper";
import { injectable } from "inversify";
import { Like } from "@/domain/entities/Like";
import type { LikeType } from "@/domain/models/Like";
import type { LikeDocument } from "../database/models/LikeModel";

@injectable()
export class LikeMapper extends Mapper<Like, LikeType | LikeDocument> {
  public toDomain(like: LikeType | LikeDocument): Like {
    return new Like({
      id: like.id.toString(),
      targetId: like.targetId.toString(),
      userId: like.userId.toString(),
      type: like.type,
    });
  }

  public toPersistence(like: Like): LikeType {
    return {
      id: like.getId(),
      targetId: like.getTargetId(),
      userId: like.getUserId(),
      type: like.getTargetType(),
    };
  }
}
