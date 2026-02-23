import type { FollowType } from "../models/Follow";

export class Follow {
  private readonly id: string;
  private readonly followerId: string;
  private readonly followingId: string;

  constructor(props: FollowType) {
    this.id = props.id;
    this.followerId = props.followedBy;
    this.followingId = props.followingTo;
  }

  // ---------------- GETTERS ----------------

  public getId(): FollowType["id"] {
    return this.id;
  }

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
