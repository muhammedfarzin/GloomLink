import { Follow } from "../../domain/entities/Follow";
import type { FollowType } from "../../domain/models/Follow";
import type { FollowDocument } from "../database/models/FollowModel";

export class FollowMapper {
  public static toDomain(follow: FollowType | FollowDocument): Follow {
    return new Follow({
      id: follow.id.toString(),
      followedBy: follow.followedBy.toString(),
      followingTo: follow.followingTo.toString(),
    });
  }

  public static toPersistence(follow: Follow): FollowType {
    return {
      id: follow.getId(),
      followedBy: follow.getFollowerId(),
      followingTo: follow.getFollowingId(),
    };
  }
}
