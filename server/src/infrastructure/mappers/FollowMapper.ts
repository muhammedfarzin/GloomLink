import { Mapper } from "./Mapper";
import { injectable } from "inversify";
import { Follow } from "@/domain/entities/Follow";
import type { FollowType } from "@/domain/models/Follow";
import type { FollowDocument } from "../database/models/FollowModel";

@injectable()
export class FollowMapper extends Mapper<Follow, FollowType | FollowDocument> {
  public toDomain(follow: FollowType | FollowDocument): Follow {
    return new Follow({
      id: follow.id.toString(),
      followedBy: follow.followedBy.toString(),
      followingTo: follow.followingTo.toString(),
    });
  }

  public toPersistence(follow: Follow): FollowType {
    return {
      id: follow.getId(),
      followedBy: follow.getFollowerId(),
      followingTo: follow.getFollowingId(),
    };
  }
}
