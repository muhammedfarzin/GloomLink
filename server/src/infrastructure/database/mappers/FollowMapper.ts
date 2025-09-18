import { Types } from "mongoose";
import { Follow } from "../../../domain/entities/Follow";
import { FollowDocument } from "../models/FollowModel";

export class FollowMapper {
  public static toDomain(followModel: FollowDocument): Follow {
    return {
      _id: followModel._id.toString(),
      followedBy: followModel.followedBy.toString(),
      followingTo: followModel.followingTo.toString(),
    };
  }

  public static toPersistence(follow: Partial<Follow>): any {
    const persistenceFollow: any = { ...follow };

    if (follow._id) {
      persistenceFollow._id = new Types.ObjectId(follow._id);
    }
    if (follow.followedBy) {
      persistenceFollow.followedBy = new Types.ObjectId(follow.followedBy);
    }
    if (follow.followingTo) {
      persistenceFollow.followingTo = new Types.ObjectId(follow.followingTo);
    }

    return persistenceFollow;
  }
}
