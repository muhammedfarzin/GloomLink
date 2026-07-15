import type { FollowType } from "../models/Follow";
import { Entity } from "./Entity";

export class Follow extends Entity {
  private readonly followerId: string;
  private readonly followingId: string;

  constructor(props: FollowType) {
    super(props);
    this.followerId = props.followedBy;
    this.followingId = props.followingTo;
  }

  // ---------------- GETTERS ----------------

  public getFollowerId(): FollowType["followedBy"] {
    return this.followerId;
  }

  public getFollowingId(): FollowType["followingTo"] {
    return this.followingId;
  }

  // --------- Boolean helpers ---------

  public isFollowing(userId: string): boolean {
    if (this.followingId === userId) {
      return true;
    }
    return false;
  }
}
